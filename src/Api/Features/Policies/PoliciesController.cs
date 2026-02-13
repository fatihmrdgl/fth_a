using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MimCrm.Api.Application;

namespace MimCrm.Api.Features.Policies;

[ApiController]
[Route("api/policies")]
[Authorize]
public class PoliciesController : ControllerBase
{
    private readonly IPolicyService _service;
    public PoliciesController(IPolicyService service) => _service = service;

    [HttpGet]
    public async Task<IEnumerable<PolicyDto>> GetAll() => await _service.GetAllAsync();

    [HttpGet("expiring")]
    public async Task<IEnumerable<ReportPolicyDto>> GetExpiring([FromQuery] int days = 30) => await _service.GetExpiringAsync(days);

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<PolicyDto>> Get(Guid id)
    {
        var item = await _service.GetAsync(id);
        return item is null ? NotFound() : Ok(item);
    }

    [HttpPost]
    public async Task<ActionResult<PolicyDto>> Create(CreatePolicyRequest request)
    {
        var created = await _service.CreateAsync(request);
        return CreatedAtAction(nameof(Get), new { id = created.Id }, created);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<PolicyDto>> Update(Guid id, UpdatePolicyRequest request)
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