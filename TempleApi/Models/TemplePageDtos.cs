namespace TempleApi.Models;

using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Http;

public sealed record EventDto(int Id, string Title, string Date, string Description, string ImageUrl);

public sealed class CreateEventRequest
{
	[Required]
	[StringLength(150, MinimumLength = 2)]
	public string Title { get; init; } = string.Empty;

	[Required]
	[StringLength(20, MinimumLength = 6)]
	public string Date { get; init; } = string.Empty;

	[StringLength(500)]
	public string Description { get; init; } = string.Empty;

	[StringLength(500)]
	[JsonPropertyName("imageUrl")]
	public string ImageUrl { get; init; } = string.Empty;
}

public sealed class UploadEventImageRequest
{
	[Required]
	public IFormFile? File { get; init; }
}

public sealed record EventImageUploadResponse(string ImageUrl);

public sealed record DonationPlanDto(int Id, string Title, string Description, string ImageUrl);

public sealed class CreateDonationPlanRequest
{
	[Required]
	[StringLength(150, MinimumLength = 2)]
	public string Title { get; init; } = string.Empty;

	[StringLength(1000)]
	public string Description { get; init; } = string.Empty;

	[StringLength(500)]
	[JsonPropertyName("imageUrl")]
	public string ImageUrl { get; init; } = string.Empty;
}

public sealed class UploadDonationPlanImageRequest
{
	[Required]
	public IFormFile? File { get; init; }
}

public sealed record DonationPlanImageUploadResponse(string ImageUrl);

public sealed record DonateInfoDto(string BankAccountName, string BankAccountNumber, string BankIfscCode, string UpiImageUrl);

public sealed class UpdateDonateInfoRequest
{
	[Required]
	[StringLength(150, MinimumLength = 2)]
	[JsonPropertyName("bankAccountName")]
	public string BankAccountName { get; init; } = string.Empty;

	[Required]
	[StringLength(50, MinimumLength = 5)]
	[JsonPropertyName("bankAccountNumber")]
	public string BankAccountNumber { get; init; } = string.Empty;

	[Required]
	[StringLength(20, MinimumLength = 4)]
	[JsonPropertyName("bankIfscCode")]
	public string BankIfscCode { get; init; } = string.Empty;

	[StringLength(500)]
	[JsonPropertyName("upiImageUrl")]
	public string UpiImageUrl { get; init; } = string.Empty;
}

public sealed class UploadDonateUpiImageRequest
{
	[Required]
	public IFormFile? File { get; init; }
}

public sealed class RegisterAccountRequest
{
	[Required]
	[StringLength(100, MinimumLength = 2)]
	public string Name { get; init; } = string.Empty;

	[Required]
	[StringLength(300, MinimumLength = 5)]
	public string Address { get; init; } = string.Empty;

	[Required]
	[EmailAddress]
	[StringLength(150)]
	public string Email { get; init; } = string.Empty;

	[Required]
	[RegularExpression(@"^[0-9+\-()\s]{10,20}$")]
	public string MobileNumber { get; init; } = string.Empty;

	[Required]
	[StringLength(100, MinimumLength = 6)]
	public string Password { get; init; } = string.Empty;
}

public sealed class LoginRequest
{
	[Required]
	[StringLength(150, MinimumLength = 3)]
	public string EmailOrMobile { get; init; } = string.Empty;

	[Required]
	[StringLength(100, MinimumLength = 6)]
	public string Password { get; init; } = string.Empty;
}

public sealed record RegisterAccountResponse(int Id, string Name, string Email, string MobileNumber, string Message);

public sealed record LoginResponse(int Id, string Name, string Email, string MobileNumber, string Role, string Token, DateTime ExpiresAtUtc, string Message);

public sealed class CreatePoojaBookingRequest
{
	[Required]
	[StringLength(100, MinimumLength = 2)]
	public string Name { get; init; } = string.Empty;

	[Required]
	[RegularExpression(@"^[0-9+\-()\s]{10,20}$")]
	public string MobileNumber { get; init; } = string.Empty;

	[Required]
	[StringLength(20, MinimumLength = 6)]
	public string Date { get; init; } = string.Empty;

	[Required]
	[StringLength(50, MinimumLength = 1)]
	public string Nalu { get; init; } = string.Empty;

	[Required]
	[StringLength(150, MinimumLength = 2)]
	public string PoojaType { get; init; } = string.Empty;
}

public sealed record PoojaBookingResponse(int Id, string Name, string MobileNumber, string Date, string Nalu, string PoojaType, string Message);

public sealed record UpcomingPoojaBookingDto(int Id, string Name, string MobileNumber, string Date, string Nalu, string PoojaType, DateTime CreatedAtUtc);

public sealed class ChangePasswordRequest
{
	[Required]
	[StringLength(100, MinimumLength = 6)]
	public string CurrentPassword { get; init; } = string.Empty;

	[Required]
	[StringLength(100, MinimumLength = 6)]
	public string NewPassword { get; init; } = string.Empty;
}

public sealed record VisitInfoDto(string Address, string Phone, string Email);

public sealed class UpdateVisitInfoRequest
{
	[Required]
	[StringLength(300, MinimumLength = 10)]
	[JsonPropertyName("address")]
	public string Address { get; init; } = string.Empty;

	[Required]
	[RegularExpression(@"^[0-9+\-()\s]{10,20}$")]
	[JsonPropertyName("phone")]
	public string Phone { get; init; } = string.Empty;

	[Required]
	[EmailAddress]
	[StringLength(150)]
	[JsonPropertyName("email")]
	public string Email { get; init; } = string.Empty;
}

public sealed record GalleryImageDto(int Id, string Title, string ImageUrl, string Description);

public sealed class UploadGalleryImageRequest
{
	[Required]
	[StringLength(150, MinimumLength = 2)]
	public string Title { get; init; } = string.Empty;

	[StringLength(500)]
	public string Description { get; init; } = string.Empty;

	[Required]
	public IFormFile? File { get; init; }
}