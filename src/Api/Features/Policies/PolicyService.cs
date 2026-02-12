using Microsoft.EntityFrameworkCore;
using MimCrm.Api.Application;
using MimCrm.Api.Domain;
using MimCrm.Api.Infrastructure;

namespace MimCrm.Api.Features.Policies;

public class PolicyService : IPolicyService
{
    private readonly AppDbContext _db;
    public PolicyService(AppDbContext db) => _db = db;

    public async Task<PolicyDto> CreateAsync(CreatePolicyRequest request)
    {
        var entity = new Policy
        {
            Id = Guid.NewGuid(),
            PolicyNumber = Guid.NewGuid().ToString("N").Substring(0, 12).ToUpperInvariant(),
            CustomerId = request.CustomerId,
            ProductId = request.ProductId,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            Premium = request.Premium,
            Status = request.Status
        };
        _db.Policies.Add(entity);
        await _db.SaveChangesAsync();
        return Map(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _db.Policies.FindAsync(id);
        if (entity != null)
        {
            _db.Policies.Remove(entity);
            await _db.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<PolicyDto>> GetAllAsync()
    {
        return await _db.Policies.AsNoTracking().Select(p => Map(p)).ToListAsync();
    }

    public async Task<PolicyDto?> GetAsync(Guid id)
    {
        var entity = await _db.Policies.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        return entity is null ? null : Map(entity);
    }

    public async Task<PolicyDto> UpdateAsync(Guid id, UpdatePolicyRequest request)
    {
        var entity = await _db.Policies.FindAsync(id) ?? throw new KeyNotFoundException();
        entity.CustomerId = request.CustomerId;
        entity.ProductId = request.ProductId;
        entity.StartDate = request.StartDate;
        entity.EndDate = request.EndDate;
        entity.Premium = request.Premium;
        entity.Status = request.Status;
        await _db.SaveChangesAsync();
        return Map(entity);
    }

    private static PolicyDto Map(Policy p) => new(p.Id, p.PolicyNumber, p.CustomerId, p.ProductId, p.StartDate, p.EndDate, p.Premium, p.Status);
}