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
    }
}