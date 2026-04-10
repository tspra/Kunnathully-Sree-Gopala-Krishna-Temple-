using Microsoft.EntityFrameworkCore;
using TempleApi.Models;

namespace TempleApi.Data;

public class TempleContentDbContext(DbContextOptions<TempleContentDbContext> options) : DbContext(options)
{
    public DbSet<TempleInfoEntity> TempleInfos => Set<TempleInfoEntity>();

    public DbSet<EventEntity> Events => Set<EventEntity>();

    public DbSet<DonationPlanEntity> DonationPlans => Set<DonationPlanEntity>();

    public DbSet<UserAccountEntity> UserAccounts => Set<UserAccountEntity>();

    public DbSet<PoojaBookingEntity> PoojaBookings => Set<PoojaBookingEntity>();

    public DbSet<VisitInfoEntity> VisitInfos => Set<VisitInfoEntity>();

    public DbSet<GalleryImageEntity> GalleryImages => Set<GalleryImageEntity>();
}