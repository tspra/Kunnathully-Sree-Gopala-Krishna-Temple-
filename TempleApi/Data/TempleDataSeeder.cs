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
                TempleName = "Sri Ananda Mandir",
                AboutTitle = "A sacred space serving devotion, culture, and community.",
                AboutDescription = "Our temple preserves timeless traditions while welcoming every family with dignity, transparency, and care.",
                HomeNoticeLabel = "ക്ഷേത്ര അറിയിപ്പ്",
                HomeNoticeTitle = "ഇന്നത്തെ പ്രധാന വിവരം",
                HomeNoticeDescription = "രാവിലെ 06:00 മുതൽ 09:00 വരെ ദർശനം ലഭ്യമാണ്. വൈകുന്നേരം 05:00 മുതൽ 08:00 വരെ വീണ്ടും ദർശനം ഉണ്ടായിരിക്കും.",
                HomeNoticeLinkText = "പൂർണ്ണ സമയക്രമം കാണുക",
                DarshanHeading = "തിങ്കൾ മുതൽ ഞായർ വരെ",
                MorningDarshanTime = "05:00 AM - 12:00 PM",
                EveningDarshanTime = "05:00 PM - 08:00 PM",
                BankAccountName = "Kunnathulli Sree Gopalakrishna Kshethram",
                BankAccountNumber = "0000000000000000",
                BankIfscCode = "XXXX0000000",
                DonateUpiImageUrl = "assets/images/upi.png"
            });
        }

        context.ScheduleItems.ExecuteDelete();
        context.ScheduleItems.AddRange(
            new ScheduleItemEntity { SortOrder = 1, Time = "-", Title = "പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 10.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 2, Time = "-", Title = "കദളിപ്പഴം നിവേദ്യം", Description = "വഴിപാടു", Price = "₹ 20.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 3, Time = "-", Title = "ഭാഗ്യസൂക്തം പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 25.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 4, Time = "-", Title = "വെള്ളനിവേദ്യം", Description = "വഴിപാടു", Price = "₹ 20.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 5, Time = "-", Title = "പുരുഷസൂക്തം പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 25.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 6, Time = "-", Title = "ഒറ്റപ്പം (ഗണപതിക്ക്)", Description = "വഴിപാടു", Price = "₹ 70.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 7, Time = "-", Title = "ശത്രുനിവാരണം പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 25.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 8, Time = "-", Title = "ബ്രഹ്മരക്ഷസ്സ് പൂജ", Description = "വഴിപാടു", Price = "₹ 150.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 9, Time = "-", Title = "സ്വയംവരം പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 25.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 10, Time = "-", Title = "നിറമാല (ചെറുത്)", Description = "വഴിപാടു", Price = "₹ 300.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 11, Time = "-", Title = "സാരസ്വതമന്ത്രം പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 25.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 12, Time = "-", Title = "നിറമാല (വലുത്)", Description = "വഴിപാടു", Price = "₹ 500.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 13, Time = "-", Title = "സന്താനഗോപാലം പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 25.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 14, Time = "-", Title = "പാൽവെണ്ണ", Description = "വഴിപാടു", Price = "₹ 50.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 15, Time = "-", Title = "ആയുസൂക്തം പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 25.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 16, Time = "-", Title = "പാലഭിഷേകം", Description = "വഴിപാടു", Price = "₹ 50.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 17, Time = "-", Title = "ധന്വന്തരീമന്ത്രം പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 25.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 18, Time = "-", Title = "കറുകഹോമം", Description = "വഴിപാടു", Price = "₹ 50.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 19, Time = "-", Title = "വിദ്യാഗോപാലമന്ത്രം പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 25.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 20, Time = "-", Title = "ഭഗവത്സേവ", Description = "വഴിപാടു", Price = "₹ 100.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 21, Time = "-", Title = "ഐകമത്വം പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 30.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 22, Time = "-", Title = "വിഷ്ണുസഹസ്രനാമം പുഷ്പാഞ്ജലി", Description = "വഴിപാടു", Price = "₹ 100.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 23, Time = "-", Title = "വിവാഹം", Description = "വഴിപാടു", Price = "₹ 500.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 24, Time = "-", Title = "വിളക്ക്", Description = "വഴിപാടു", Price = "₹ 10.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 25, Time = "-", Title = "സരസ്വതി പൂജ", Description = "വഴിപാടു", Price = "₹ 50.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 26, Time = "-", Title = "മാല", Description = "വഴിപാടു", Price = "₹ 10.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 27, Time = "-", Title = "വിദ്യാരംഭം", Description = "വഴിപാടു", Price = "₹ 50.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 28, Time = "-", Title = "കറുകമാല", Description = "വഴിപാടു", Price = "₹ 10.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 29, Time = "-", Title = "തുലാഭാരം", Description = "വഴിപാടു", Price = "₹ 50.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 30, Time = "-", Title = "നെയ് വിളക്ക്", Description = "വഴിപാടു", Price = "₹ 20.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 31, Time = "-", Title = "വാഹനപൂജ", Description = "വഴിപാടു", Price = "₹ 100.00", Category = "എല്ലാം" },
            new ScheduleItemEntity { SortOrder = 32, Time = "-", Title = "നെൽപറ", Description = "വഴിപാടു", Price = "₹ 150.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 33, Time = "-", Title = "കെട്ടുനിറ", Description = "വഴിപാടു", Price = "₹ 20.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 34, Time = "-", Title = "നിത്യപൂജ", Description = "വഴിപാടു", Price = "₹ 100.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 35, Time = "-", Title = "നവഗ്രഹപൂജ", Description = "വഴിപാടു", Price = "₹ 500.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 36, Time = "-", Title = "ത്രികാലപൂജ", Description = "വഴിപാടു", Price = "₹ 300.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 37, Time = "-", Title = "ഗണപതിഹോമം", Description = "വഴിപാടു", Price = "₹ 50.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 38, Time = "-", Title = "ലക്ഷ്മീനാരായണ പൂജ (ചെറുത്)", Description = "വഴിപാടു", Price = "₹ 100.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 39, Time = "-", Title = "പാൽപായസം", Description = "വഴിപാടു", Price = "₹ 50.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 40, Time = "-", Title = "ലക്ഷ്മീനാരായണ പൂജ (വലുത്)", Description = "വഴിപാടു", Price = "₹ 300.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 41, Time = "-", Title = "ശർക്കരപായസം", Description = "വഴിപാടു", Price = "₹ 40.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 42, Time = "-", Title = "സുദർശനഹോമം", Description = "വഴിപാടു", Price = "₹ 350.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 43, Time = "-", Title = "ശംഖാഭിഷേകം", Description = "വഴിപാടു", Price = "₹ 10.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 44, Time = "-", Title = "ചുറ്റുവിളക്ക്", Description = "വഴിപാടു", Price = "₹ 2500.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 45, Time = "-", Title = "മലർനിവേദ്യം", Description = "വഴിപാടു", Price = "₹ 15.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 46, Time = "-", Title = "മുഴുക്കാപ്പ്", Description = "വഴിപാടു", Price = "₹ 2500.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 47, Time = "-", Title = "അവിൽനിവേദ്യം", Description = "വഴിപാടു", Price = "₹ 20.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 48, Time = "-", Title = "പാൽപായസം (ഒരു കുടം പാൽ)", Description = "വഴിപാടു", Price = "₹ 1800.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 49, Time = "-", Title = "തൃമധുരം", Description = "വഴിപാടു", Price = "₹ 30.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 50, Time = "-", Title = "പന്തീരാഴി (പാൽ)", Description = "വഴിപാടു", Price = "₹ 4500.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 51, Time = "-", Title = "കെടാവിളക്ക്", Description = "വഴിപാടു", Price = "₹ 100.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 52, Time = "-", Title = "ഉദയാസ്തമന പൂജ", Description = "വഴിപാടു", Price = "₹ 20000.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" },
            new ScheduleItemEntity { SortOrder = 53, Time = "-", Title = "വെണ്ണനിവേദ്യം", Description = "വഴിപാടു", Price = "₹ 20.00", Category = "മുൻകൂട്ടി അറിയിക്കേണ്ടവ" }
        );

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
                Email = "info@srianandamandir.org",
                VisitingHours = "Open daily from 5:30 AM to 8:30 PM"
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