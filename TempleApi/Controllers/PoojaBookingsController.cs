using System.Security.Claims;
using System.Globalization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TempleApi.Data;
using TempleApi.Models;

namespace TempleApi.Controllers;

[ApiController]
[Authorize(Roles = "Admin")]
[Route("api/pooja-bookings")]
public class PoojaBookingsController(TempleContentDbContext dbContext) : ControllerBase
{
    [HttpGet("upcoming")]
    public async Task<ActionResult<IReadOnlyList<UpcomingPoojaBookingDto>>> GetUpcomingBookings(CancellationToken cancellationToken)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);

        var bookings = await dbContext.PoojaBookings
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var upcomingBookings = bookings
            .Select(booking => new
            {
                Booking = booking,
                Date = ParseBookingDate(booking.Date)
            })
            .Where(item => item.Date is not null && item.Date.Value >= today)
            .OrderBy(item => item.Date)
            .ThenBy(item => item.Booking.CreatedAtUtc)
            .Select(item => new UpcomingPoojaBookingDto(
                item.Booking.Id,
                item.Booking.Name,
                item.Booking.MobileNumber,
                item.Booking.Date,
                item.Booking.Nalu,
                item.Booking.PoojaType,
                item.Booking.CreatedAtUtc))
            .ToList();

        return Ok(upcomingBookings);
    }

    [HttpPost]
    public async Task<ActionResult<PoojaBookingResponse>> CreateBooking(
        CreatePoojaBookingRequest request,
        CancellationToken cancellationToken)
    {
        var accountIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!int.TryParse(accountIdClaim, out var userAccountId))
        {
            return Unauthorized();
        }

        var booking = new PoojaBookingEntity
        {
            UserAccountId = userAccountId,
            Name = request.Name.Trim(),
            MobileNumber = request.MobileNumber.Trim(),
            Date = request.Date.Trim(),
            Nalu = request.Nalu.Trim(),
            PoojaType = request.PoojaType.Trim(),
            CreatedAtUtc = DateTime.UtcNow
        };

        dbContext.PoojaBookings.Add(booking);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new PoojaBookingResponse(
            booking.Id,
            booking.Name,
            booking.MobileNumber,
            booking.Date,
            booking.Nalu,
            booking.PoojaType,
            "പൂജ ബുക്കിംഗ് വിജയകരമായി രജിസ്റ്റർ ചെയ്തു."));
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
