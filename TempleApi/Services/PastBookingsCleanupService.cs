using System.Globalization;
using Microsoft.EntityFrameworkCore;
using TempleApi.Data;

namespace TempleApi.Services;

public class PastBookingsCleanupService(IServiceScopeFactory scopeFactory, ILogger<PastBookingsCleanupService> logger) : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        // Run once at startup, then every 24 hours
        while (!stoppingToken.IsCancellationRequested)
        {
            await DeletePastBookingsAsync(stoppingToken);

            // Wait until midnight UTC, then run again
            var now = DateTime.UtcNow;
            var nextMidnight = now.Date.AddDays(1);
            var delay = nextMidnight - now;
            await Task.Delay(delay, stoppingToken);
        }
    }

    private async Task DeletePastBookingsAsync(CancellationToken cancellationToken)
    {
        try
        {
            using var scope = scopeFactory.CreateScope();
            var dbContext = scope.ServiceProvider.GetRequiredService<TempleContentDbContext>();

            var today = DateOnly.FromDateTime(DateTime.UtcNow);

            var allBookings = await dbContext.PoojaBookings.ToListAsync(cancellationToken);

            var pastBookings = allBookings
                .Where(booking =>
                {
                    var date = ParseBookingDate(booking.Date);
                    return date is not null && date.Value < today;
                })
                .ToList();

            if (pastBookings.Count > 0)
            {
                dbContext.PoojaBookings.RemoveRange(pastBookings);
                await dbContext.SaveChangesAsync(cancellationToken);
                logger.LogInformation("Deleted {Count} past pooja booking(s) on {Date}.", pastBookings.Count, today);
            }
            else
            {
                logger.LogInformation("No past pooja bookings to delete on {Date}.", today);
            }
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogError(ex, "Error occurred while cleaning up past pooja bookings.");
        }
    }

    private static DateOnly? ParseBookingDate(string value)
    {
        if (DateOnly.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var date))
        {
            return date;
        }

        if (DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDateTime))
        {
            return DateOnly.FromDateTime(parsedDateTime);
        }

        return null;
    }
}
