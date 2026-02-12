using Microsoft.EntityFrameworkCore;
using MimCrm.Api.Application;
using MimCrm.Api.Domain;
using MimCrm.Api.Infrastructure;

namespace MimCrm.Api.Features.Products;

public class ProductService : IProductService
{
    private readonly AppDbContext _db;
    public ProductService(AppDbContext db) => _db = db;

    public async Task<ProductDto> CreateAsync(CreateProductRequest request)
    {
        var entity = new Product
        {
            Id = Guid.NewGuid(),
            Code = request.Code,
            Name = request.Name,
            Description = request.Description,
            BasePrice = request.BasePrice,
            IsActive = request.IsActive
        };
        _db.Products.Add(entity);
        await _db.SaveChangesAsync();
        return Map(entity);
    }

    public async Task DeleteAsync(Guid id)
    {
        var entity = await _db.Products.FindAsync(id);
        if (entity != null)
        {
            _db.Products.Remove(entity);
            await _db.SaveChangesAsync();
        }
    }

    public async Task<IEnumerable<ProductDto>> GetAllAsync()
    {
        return await _db.Products.AsNoTracking().Select(p => Map(p)).ToListAsync();
    }

    public async Task<ProductDto?> GetAsync(Guid id)
    {
        var entity = await _db.Products.AsNoTracking().FirstOrDefaultAsync(p => p.Id == id);
        return entity is null ? null : Map(entity);
    }

    public async Task<ProductDto> UpdateAsync(Guid id, UpdateProductRequest request)
    {
        var entity = await _db.Products.FindAsync(id) ?? throw new KeyNotFoundException();
        entity.Code = request.Code;
        entity.Name = request.Name;
        entity.Description = request.Description;
        entity.BasePrice = request.BasePrice;
        entity.IsActive = request.IsActive;
        await _db.SaveChangesAsync();
        return Map(entity);
    }

    private static ProductDto Map(Product p) => new(p.Id, p.Code, p.Name, p.Description, p.BasePrice, p.IsActive);
}