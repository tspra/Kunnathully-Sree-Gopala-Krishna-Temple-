using Microsoft.EntityFrameworkCore;

namespace TempleApi.Models;

public class TempleInfoEntity
{
    public int Id { get; set; }

    public string BankAccountName { get; set; } = string.Empty;

    public string BankAccountNumber { get; set; } = string.Empty;

    public string BankIfscCode { get; set; } = string.Empty;

    public string DonateUpiImageUrl { get; set; } = string.Empty;
}

public class EventEntity
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Date { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;
}

public class DonationPlanEntity
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Contribution { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;
}

[Index(nameof(MobileNumber), IsUnique = true)]
public class UserAccountEntity
{
    public int Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string MobileNumber { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string PasswordSalt { get; set; } = string.Empty;

    public string Role { get; set; } = "Admin";

    public DateTime CreatedAtUtc { get; set; }
}

public class PoojaBookingEntity
{
    public int Id { get; set; }

    public int UserAccountId { get; set; }

    public string Name { get; set; } = string.Empty;

    public string MobileNumber { get; set; } = string.Empty;

    public string Date { get; set; } = string.Empty;

    public string Nalu { get; set; } = string.Empty;

    public string PoojaType { get; set; } = string.Empty;

    public DateTime CreatedAtUtc { get; set; }
}

public class VisitInfoEntity
{
    public int Id { get; set; }

    public string Address { get; set; } = string.Empty;

    public string Phone { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;
}

public class GalleryImageEntity
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string ImageUrl { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;
}