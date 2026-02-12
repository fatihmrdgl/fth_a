using Microsoft.AspNetCore.Mvc;
using MimCrm.Api.Application;

namespace MimCrm.Api.Features.Auth;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IUserService _users;
    public AuthController(IUserService users) => _users = users;

    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register(RegisterRequest request)
    {
        var result = await _users.RegisterAsync(request);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login(LoginRequest request)
    {
        var result = await _users.LoginAsync(request);
        return Ok(result);
    }
}