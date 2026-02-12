using Microsoft.EntityFrameworkCore;
using MimCrm.Api.Application;
using MimCrm.Api.Domain;
using MimCrm.Api.Infrastructure;

namespace MimCrm.Api.Features.Auth;

public class UserService : IUserService
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher _hasher;
    private readonly ITokenService _tokens;

    public UserService(AppDbContext db, IPasswordHasher hasher, ITokenService tokens)
    {
        _db = db;
        _hasher = hasher;
        _tokens = tokens;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        if (await _db.Users.AnyAsync(u => u.Email == request.Email))
            throw new InvalidOperationException("Email already exists");

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            PasswordHash = _hasher.Hash(request.Password),
            FullName = request.FullName,
            Role = "Agent"
        };

        _db.Users.Add(user);
        await _db.SaveChangesAsync();

        var token = _tokens.CreateToken(user);
        return new AuthResponse(token, user.Email, user.FullName, user.Role);
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _db.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        if (user is null || !_hasher.Verify(request.Password, user.PasswordHash))
            throw new InvalidOperationException("Invalid credentials");

        var token = _tokens.CreateToken(user);
        return new AuthResponse(token, user.Email, user.FullName, user.Role);
    }
}