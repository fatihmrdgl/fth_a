namespace MimCrm.Api.Application;

public interface IPolicyService
{
    Task<IEnumerable<PolicyDto>> GetAllAsync();
    Task<PolicyDto?> GetAsync(Guid id);
    Task<PolicyDto> CreateAsync(CreatePolicyRequest request);
    Task<PolicyDto> UpdateAsync(Guid id, UpdatePolicyRequest request);
    Task DeleteAsync(Guid id);
}