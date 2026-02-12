using MimCrm.Api.Domain;

namespace MimCrm.Api.Application;

public interface IUserService
{
    Task<AuthResponse> RegisterAsync(RegisterRequest request);
    Task<AuthResponse> LoginAsync(LoginRequest request);
}