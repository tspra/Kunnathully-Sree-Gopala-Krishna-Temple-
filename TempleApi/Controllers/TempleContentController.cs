using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.StaticFiles;
using System.Globalization;
using System.Text.RegularExpressions;
using TempleApi.Data;
using TempleApi.Models;

namespace TempleApi.Controllers;

[ApiController]
[Route("api/content")]
public class TempleContentController(TempleContentDbContext dbContext, IWebHostEnvironment environment, IConfiguration configuration) : ControllerBase
{
    [HttpGet("events")]
    public async Task<ActionResult<IReadOnlyList<EventDto>>> GetEvents(CancellationToken cancellationToken)
    {
        var eventsData = await dbContext.Events
            .AsNoTracking()
            .OrderBy(eventItem => eventItem.Id)
            .Select(eventItem => new EventDto(
                eventItem.Id,
                eventItem.Title,
                eventItem.Date,
                eventItem.Description,
                string.IsNullOrWhiteSpace(eventItem.ImageUrl) ? "assets/images/Image1.PNG" : eventItem.ImageUrl))
            .ToListAsync(cancellationToken);

        return Ok(eventsData);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("events")]
    public async Task<ActionResult<EventDto>> CreateEvent(
        CreateEventRequest request,
        CancellationToken cancellationToken)
    {
        var eventEntity = new EventEntity
        {
            Title = request.Title.Trim(),
            Date = request.Date.Trim(),
            Description = request.Description.Trim(),
            ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? "assets/images/Image1.PNG" : request.ImageUrl.Trim()
        };

        dbContext.Events.Add(eventEntity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(
            nameof(GetEvents),
            new EventDto(eventEntity.Id, eventEntity.Title, eventEntity.Date, eventEntity.Description, eventEntity.ImageUrl));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("events/upload-image")]
    [RequestSizeLimit(10_000_000)]
    public async Task<ActionResult<EventImageUploadResponse>> UploadEventImage(
        [FromForm] UploadEventImageRequest request,
        CancellationToken cancellationToken)
    {
        if (request.File is null || request.File.Length == 0)
        {
            return BadRequest(new { message = "Please select an image file." });
        }

        if (!request.File.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Only image files are allowed." });
        }

        var extension = Path.GetExtension(request.File.FileName);
        if (string.IsNullOrWhiteSpace(extension))
        {
            extension = ".jpg";
        }

        var uploadsDirectory = GetUploadsDirectory();

        var fileName = $"event_{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var savedPath = Path.Combine(uploadsDirectory, fileName);

        await using (var fileStream = System.IO.File.Create(savedPath))
        {
            await request.File.CopyToAsync(fileStream, cancellationToken);
        }

        return Ok(new EventImageUploadResponse($"/api/content/gallery/file/{fileName}"));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("events/{id:int}")]
    public async Task<ActionResult> DeletePastEvent(int id, CancellationToken cancellationToken)
    {
        var eventEntity = await dbContext.Events.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (eventEntity is null)
        {
            return NotFound(new { message = "Event not found." });
        }

        var eventDate = ParseEventDate(eventEntity.Date);
        if (eventDate is null)
        {
            return BadRequest(new { message = "Event date is invalid and cannot be evaluated as past." });
        }

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        if (eventDate.Value >= today)
        {
            return BadRequest(new { message = "Only past events can be deleted." });
        }

        dbContext.Events.Remove(eventEntity);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Past event deleted successfully." });
    }

    [HttpGet("donate")]
    public async Task<ActionResult<IReadOnlyList<DonationPlanDto>>> GetDonationPlans(CancellationToken cancellationToken)
    {
        var plans = await dbContext.DonationPlans
            .AsNoTracking()
            .OrderBy(plan => plan.Id)
            .Select(plan => new DonationPlanDto(
                plan.Id,
                plan.Title,
                plan.Description,
                string.IsNullOrWhiteSpace(plan.ImageUrl) ? "assets/images/donate.png" : plan.ImageUrl))
            .ToListAsync(cancellationToken);

        return Ok(plans);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("donate")]
    public async Task<ActionResult<DonationPlanDto>> CreateDonationPlan(
        CreateDonationPlanRequest request,
        CancellationToken cancellationToken)
    {
        var plan = new DonationPlanEntity
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            ImageUrl = string.IsNullOrWhiteSpace(request.ImageUrl) ? "assets/images/donate.png" : request.ImageUrl.Trim()
        };

        dbContext.DonationPlans.Add(plan);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new DonationPlanDto(plan.Id, plan.Title, plan.Description, plan.ImageUrl));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("donate/{id:int}")]
    public async Task<ActionResult> DeleteDonationPlan(int id, CancellationToken cancellationToken)
    {
        var plan = await dbContext.DonationPlans.FirstOrDefaultAsync(item => item.Id == id, cancellationToken);
        if (plan is null)
        {
            return NotFound(new { message = "Donation item not found." });
        }

        dbContext.DonationPlans.Remove(plan);
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new { message = "Donation item deleted successfully." });
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("donate/upload-image")]
    [RequestSizeLimit(10_000_000)]
    public async Task<ActionResult<DonationPlanImageUploadResponse>> UploadDonationPlanImage(
        [FromForm] UploadDonationPlanImageRequest request,
        CancellationToken cancellationToken)
    {
        if (request.File is null || request.File.Length == 0)
        {
            return BadRequest(new { message = "Please select an image file." });
        }

        if (!request.File.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Only image files are allowed." });
        }

        var extension = Path.GetExtension(request.File.FileName);
        if (string.IsNullOrWhiteSpace(extension))
        {
            extension = ".jpg";
        }

        var uploadsDirectory = GetUploadsDirectory();

        var fileName = $"donate_{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var savedPath = Path.Combine(uploadsDirectory, fileName);

        await using (var fileStream = System.IO.File.Create(savedPath))
        {
            await request.File.CopyToAsync(fileStream, cancellationToken);
        }

        return Ok(new DonationPlanImageUploadResponse($"/api/content/gallery/file/{fileName}"));
    }

    [HttpGet("donate-info")]
    public async Task<ActionResult<DonateInfoDto>> GetDonateInfo(CancellationToken cancellationToken)
    {
        var temple = await dbContext.TempleInfos.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
        if (temple is null)
        {
            return NotFound();
        }

        return Ok(new DonateInfoDto(
            string.IsNullOrWhiteSpace(temple.BankAccountName) ? "Kunnathulli Sree Gopalakrishna Kshethram" : temple.BankAccountName,
            string.IsNullOrWhiteSpace(temple.BankAccountNumber) ? "0000000000000000" : temple.BankAccountNumber,
            string.IsNullOrWhiteSpace(temple.BankIfscCode) ? "XXXX0000000" : temple.BankIfscCode,
            string.IsNullOrWhiteSpace(temple.DonateUpiImageUrl) ? "assets/images/upi.png" : temple.DonateUpiImageUrl));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("donate-info")]
    public async Task<ActionResult<DonateInfoDto>> UpdateDonateInfo(
        UpdateDonateInfoRequest request,
        CancellationToken cancellationToken)
    {
        var temple = await dbContext.TempleInfos.FirstOrDefaultAsync(cancellationToken);
        if (temple is null)
        {
            return NotFound(new { message = "Temple info not found." });
        }

        temple.BankAccountName = request.BankAccountName.Trim();
        temple.BankAccountNumber = request.BankAccountNumber.Trim();
        temple.BankIfscCode = request.BankIfscCode.Trim();

        if (!string.IsNullOrWhiteSpace(request.UpiImageUrl))
        {
            temple.DonateUpiImageUrl = request.UpiImageUrl.Trim();
        }

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new DonateInfoDto(
            temple.BankAccountName,
            temple.BankAccountNumber,
            temple.BankIfscCode,
            temple.DonateUpiImageUrl));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("donate-info/upload-upi")]
    [RequestSizeLimit(10_000_000)]
    public async Task<ActionResult<DonateInfoDto>> UploadDonateUpiImage(
        [FromForm] UploadDonateUpiImageRequest request,
        CancellationToken cancellationToken)
    {
        if (request.File is null || request.File.Length == 0)
        {
            return BadRequest(new { message = "Please select an image file." });
        }

        if (!request.File.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Only image files are allowed." });
        }

        var temple = await dbContext.TempleInfos.FirstOrDefaultAsync(cancellationToken);
        if (temple is null)
        {
            return NotFound(new { message = "Temple info not found." });
        }

        var extension = Path.GetExtension(request.File.FileName);
        if (string.IsNullOrWhiteSpace(extension))
        {
            extension = ".png";
        }

        var uploadsDirectory = GetUploadsDirectory();

        var fileName = $"donate_upi_{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var savedPath = Path.Combine(uploadsDirectory, fileName);

        await using (var fileStream = System.IO.File.Create(savedPath))
        {
            await request.File.CopyToAsync(fileStream, cancellationToken);
        }

        temple.DonateUpiImageUrl = $"/api/content/gallery/file/{fileName}";
        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new DonateInfoDto(
            temple.BankAccountName,
            temple.BankAccountNumber,
            temple.BankIfscCode,
            temple.DonateUpiImageUrl));
    }


    [HttpGet("visit")]
    public async Task<ActionResult<VisitInfoDto>> GetVisitInfo(CancellationToken cancellationToken)
    {
        var visit = await dbContext.VisitInfos.AsNoTracking().FirstOrDefaultAsync(cancellationToken);
        if (visit is null)
        {
            return NotFound();
        }

        return Ok(new VisitInfoDto(visit.Address, visit.Phone, visit.Email));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("visit")]
    public async Task<ActionResult<VisitInfoDto>> UpdateVisitInfo(
        UpdateVisitInfoRequest request,
        CancellationToken cancellationToken)
    {
        var visit = await dbContext.VisitInfos.FirstOrDefaultAsync(cancellationToken);
        if (visit is null)
        {
            return NotFound(new { message = "Visit info not found." });
        }

        visit.Address = request.Address.Trim();
        visit.Phone = request.Phone.Trim();
        visit.Email = request.Email.Trim();

        await dbContext.SaveChangesAsync(cancellationToken);

        return Ok(new VisitInfoDto(visit.Address, visit.Phone, visit.Email));
    }

    [HttpGet("gallery")]
    public async Task<ActionResult<IReadOnlyList<GalleryImageDto>>> GetGalleryImages(CancellationToken cancellationToken)
    {
        var images = await dbContext.GalleryImages
            .AsNoTracking()
            .OrderBy(image => image.Id)
            .Select(image => new GalleryImageDto(image.Id, image.Title, image.ImageUrl, image.Description))
            .ToListAsync(cancellationToken);

        return Ok(images);
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("gallery/upload")]
    [RequestSizeLimit(10_000_000)]
    public async Task<ActionResult<GalleryImageDto>> UploadGalleryImage(
        [FromForm] UploadGalleryImageRequest request,
        CancellationToken cancellationToken)
    {
        if (request.File is null || request.File.Length == 0)
        {
            return BadRequest(new { message = "Please select an image file." });
        }

        if (!request.File.ContentType.StartsWith("image/", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Only image files are allowed." });
        }

        var extension = Path.GetExtension(request.File.FileName);
        if (string.IsNullOrWhiteSpace(extension))
        {
            extension = ".jpg";
        }

        var uploadsDirectory = GetUploadsDirectory();

        var fileName = $"gallery_{Guid.NewGuid():N}{extension.ToLowerInvariant()}";
        var savedPath = Path.Combine(uploadsDirectory, fileName);

        await using (var fileStream = System.IO.File.Create(savedPath))
        {
            await request.File.CopyToAsync(fileStream, cancellationToken);
        }

        var image = new GalleryImageEntity
        {
            Title = request.Title.Trim(),
            Description = request.Description.Trim(),
            ImageUrl = $"/api/content/gallery/file/{fileName}"
        };

        dbContext.GalleryImages.Add(image);
        await dbContext.SaveChangesAsync(cancellationToken);

        return CreatedAtAction(
            nameof(GetGalleryImages),
            new GalleryImageDto(image.Id, image.Title, image.ImageUrl, image.Description));
    }

    [HttpGet("gallery/file/{fileName}")]
    public IActionResult GetGalleryFile(string fileName)
    {
        var safeFileName = Path.GetFileName(fileName);
        if (!string.Equals(fileName, safeFileName, StringComparison.Ordinal))
        {
            return NotFound();
        }

        var uploadsDirectory = GetUploadsDirectory();
        var filePath = Path.Combine(uploadsDirectory, safeFileName);
        if (!System.IO.File.Exists(filePath))
        {
            return NotFound();
        }

        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(filePath, out var contentType))
        {
            contentType = "application/octet-stream";
        }

        return PhysicalFile(filePath, contentType);
    }

    private string GetUploadsDirectory()
    {
        var configuredPath = configuration["Uploads:RootPath"];
        var uploadsDirectory = string.IsNullOrWhiteSpace(configuredPath)
            ? Path.Combine(environment.ContentRootPath, "Uploads")
            : configuredPath;

        Directory.CreateDirectory(uploadsDirectory);
        return uploadsDirectory;
    }

    private static DateOnly? ParseEventDate(string value)
    {
        if (DateOnly.TryParseExact(value, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out var exactDate))
        {
            return exactDate;
        }

        var monthDateMatch = Regex.Match(value.Trim(), "^([^\\d,]+)\\s+(\\d{1,2}),\\s*(\\d{4})$");
        if (monthDateMatch.Success)
        {
            var monthName = monthDateMatch.Groups[1].Value.Trim().ToLowerInvariant();
            var day = int.Parse(monthDateMatch.Groups[2].Value, CultureInfo.InvariantCulture);
            var year = int.Parse(monthDateMatch.Groups[3].Value, CultureInfo.InvariantCulture);

            var monthLookup = new Dictionary<string, int>
            {
                ["january"] = 1,
                ["february"] = 2,
                ["march"] = 3,
                ["april"] = 4,
                ["may"] = 5,
                ["june"] = 6,
                ["july"] = 7,
                ["august"] = 8,
                ["september"] = 9,
                ["october"] = 10,
                ["november"] = 11,
                ["december"] = 12,
                ["ജനുവരി"] = 1,
                ["ഫെബ്രുവരി"] = 2,
                ["മാർച്ച്"] = 3,
                ["ഏപ്രിൽ"] = 4,
                ["മെയ്"] = 5,
                ["ജൂൺ"] = 6,
                ["ജൂലൈ"] = 7,
                ["ഓഗസ്റ്റ്"] = 8,
                ["സെപ്റ്റംബർ"] = 9,
                ["ഒക്ടോബർ"] = 10,
                ["നവംബർ"] = 11,
                ["ഡിസംബർ"] = 12
            };

            if (monthLookup.TryGetValue(monthName, out var month))
            {
                return new DateOnly(year, month, day);
            }
        }

        if (DateTime.TryParse(value, CultureInfo.InvariantCulture, DateTimeStyles.None, out var parsedDate))
        {
            return DateOnly.FromDateTime(parsedDate);
        }

        return null;
    }
}