using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MimCrm.Api.Application;

namespace MimCrm.Api.Features.Products;

[ApiController]
[Route("api/products")]
[Authorize]
public class ProductsController : ControllerBase
{
    private readonly IProductService _service;
    public ProductsController(IProductService service) => _service = service;

    [HttpGet]
    public async Task<IEnumerable<ProductDto>> GetAll() => await _service.GetAllAsync();

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<ProductDto>> Get(Guid id)
    {
        var item = await _service.GetAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<ProductDto>> Create(CreateProductRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<ProductDto>> Update(Guid id, UpdateProductRequest request)
    {
        var updated = await _service.UpdateAsync(id, request);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        await _service.DeleteAsync(id);
        return NoContent();
    }
}