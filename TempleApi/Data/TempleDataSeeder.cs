using System.Security.Cryptography;
using TempleApi.Models;
using Microsoft.EntityFrameworkCore;

namespace TempleApi.Data;

public static class TempleDataSeeder
{
    public static void Seed(TempleContentDbContext context)
    {

        if (!context.TempleInfos.Any())
        {
            context.TempleInfos.Add(new TempleInfoEntity
            {
                BankAccountName = "Kunnathulli Sree Gopalakrishna Kshethram",
                BankAccountNumber = "0000000000000000",
                BankIfscCode = "XXXX0000000",
                DonateUpiImageUrl = "assets/images/upi.png"
            });
        }

        context.Events.ExecuteDelete();
        context.Events.AddRange();
          
           

        if (!context.DonationPlans.Any())
        {
            context.DonationPlans.AddRange(
                new DonationPlanEntity
                {
                    Title = "അന്നദാന നിധി",
                    Description = "ദിവസേന പ്രസാദ വിതരണത്തിനും അന്നദാന സേവനങ്ങൾക്കും പിന്തുണ നൽകാം.",
                    Contribution = "രൂ. 1,001 മുതൽ",
                    ImageUrl = "assets/images/donate.png"
                },
                new DonationPlanEntity
                {
                    Title = "വിളക്ക് വഴിപാടു സഹായം",
                    Description = "ദീപം, പൂജ ക്രമീകരണങ്ങൾ, സായാഹ്ന ആരാധന എന്നിവയ്ക്കുള്ള സംഭാവന.",
                    Contribution = "രൂ. 501 മുതൽ",
                    ImageUrl = "assets/images/donate.png"
                }
            );
        }

        if (!context.VisitInfos.Any())
        {
            context.VisitInfos.Add(new VisitInfoEntity
            {
                Address = "125 Lotus Avenue, Heritage Square, Your City",
                Phone = "+1 (555) 108-1088",
                Email = "info@srianandamandir.org"
            });
        }

        if (!context.GalleryImages.Any())
        {
            context.GalleryImages.AddRange(
                new GalleryImageEntity
                {
                    Title = "Temple Entrance",
                    ImageUrl = "assets/images/Image1.PNG",
                    Description = "Main temple entrance during morning darshan."
                }
            );
        }

        var adminSalt = RandomNumberGenerator.GetBytes(16);
        var adminHash = Rfc2898DeriveBytes.Pbkdf2("Admin@1234", adminSalt, 100_000, HashAlgorithmName.SHA256, 32);
        var adminSaltB64 = Convert.ToBase64String(adminSalt);
        var adminHashB64 = Convert.ToBase64String(adminHash);

        if (!context.UserAccounts.Any(u => u.MobileNumber == "9999999999"))
        {
            context.UserAccounts.Add(new UserAccountEntity
            {
                Name = "Temple Admin",
                Address = "Temple Office",
                Email = "admin@temple.org",
                MobileNumber = "9999999999",
                PasswordHash = adminHashB64,
                PasswordSalt = adminSaltB64,
                Role = "Admin",
                CreatedAtUtc = DateTime.UtcNow
            });
        }

        context.SaveChanges();
    }
}