using Microsoft.EntityFrameworkCore;
using MimCrm.Api.Domain;

namespace MimCrm.Api.Infrastructure;

public class AppDbContext : DbContext
{
    public DbSet<User> Users => Set<User>();
    public DbSet<Customer> Customers => Set<Customer>();
    public DbSet<Product> Products => Set<Product>();
    public DbSet<Policy> Policies => Set<Policy>();

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<User>().HasIndex(x => x.Email).IsUnique();
        modelBuilder.Entity<Customer>().HasIndex(x => x.NationalId).IsUnique();
        modelBuilder.Entity<Product>().HasIndex(x => x.Code).IsUnique();
        modelBuilder.Entity<Policy>().HasIndex(x => x.PolicyNumber).IsUnique();
            
            // Ensure PolicyStatus string mapping tolerates existing English/Turkish values in DB
            var statusConverter = new Microsoft.EntityFrameworkCore.Storage.ValueConversion.ValueConverter<Domain.PolicyStatus, string>(
                v => v.ToString(),
                v => ConvertToPolicyStatus(v)
            );
            
            modelBuilder.Entity<Policy>().Property(p => p.Status).HasConversion(statusConverter);
    }
        
        private static Domain.PolicyStatus ConvertToPolicyStatus(string v)
        {
            if (string.IsNullOrEmpty(v)) return Domain.PolicyStatus.Teklif;
            // Try parse directly (case-insensitive)
            if (System.Enum.TryParse<Domain.PolicyStatus>(v, true, out var parsed)) return parsed;
            
            // Map common English values to enum names
            return v.ToLowerInvariant() switch
            {
                "active" => Domain.PolicyStatus.Aktif,
                "aktif" => Domain.PolicyStatus.Aktif,
                "offer" => Domain.PolicyStatus.Teklif,
                "proposal" => Domain.PolicyStatus.Teklif,
                "teklif" => Domain.PolicyStatus.Teklif,
                "finished" => Domain.PolicyStatus.Sonlanmis,
                "expired" => Domain.PolicyStatus.Sonlanmis,
                "sonlanmis" => Domain.PolicyStatus.Sonlanmis,
                "cancelled" => Domain.PolicyStatus.IptalEdilmis,
                "canceled" => Domain.PolicyStatus.IptalEdilmis,
                "iptaledilmis" => Domain.PolicyStatus.IptalEdilmis,
                _ => throw new System.InvalidOperationException($"Unknown PolicyStatus value '{v}' in database.")
            };
        }
}