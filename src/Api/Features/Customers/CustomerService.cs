using Microsoft.EntityFrameworkCore;
using MimCrm.Api.Application;
using MimCrm.Api.Domain;
using MimCrm.Api.Infrastructure;

namespace MimCrm.Api.Features.Customers;

public class CustomerService : ICustomerService
{
    private readonly AppDbContext _db;
    public CustomerService(AppDbContext db) => _db = db;

    public async Task<CustomerDto> CreateAsync(CreateCustomerRequest request)
    {
        var entity = new Customer
        {
            Id = Guid.NewGuid(),
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            Phone = request.Phone,
            NationalId = request.NationalId,
            Address = request.Address
        };
        _db.Customers.Add(entity);
        await _db.SaveChangesAsync();
        return Map(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _db.Customers.FindAsync(id);
        if (entity != null)
        {
            _db.Customers.Remove(entity);
            await _db.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<CustomerDto>> GetAllAsync()
    {
        return await _db.Customers
            .AsNoTracking()
            .Select(c => Map(c))
            .ToListAsync();
    }

    public async Task<CustomerDto?> GetAsync(Guid id)
    {
        var entity = await _db.Customers.AsNoTracking().FirstOrDefaultAsync(c => c.Id == id);
        return entity is null ? null : Map(entity);
    }

    public async Task<CustomerDto> UpdateAsync(Guid id, UpdateCustomerRequest request)
    {
        var entity = await _db.Customers.FindAsync(id) ?? throw new KeyNotFoundException();
        entity.FirstName = request.FirstName;
        entity.LastName = request.LastName;
        entity.Email = request.Email;
        entity.Phone = request.Phone;
        entity.NationalId = request.NationalId;
        entity.Address = request.Address;
        await _db.SaveChangesAsync();
        return Map(entity);
    }

    private static CustomerDto Map(Customer c) => new(c.Id, c.FirstName, c.LastName, c.Email, c.Phone, c.NationalId, c.Address, c.CreatedAt);
}