using backend.Data;
using backend.DTO;
using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace backend.Services;

public sealed class AuthService : IAuthService
{
    private readonly AppDbContext dbContext;
    private readonly IConfiguration configuration;

    public AuthService(AppDbContext dbContext, IConfiguration configuration)
    {
        this.dbContext = dbContext;
        this.configuration = configuration;
    }

    public async Task<User> RegisterAsync(RegisterDto dto)
    {
        var exists = await dbContext.Users.AnyAsync(x => x.Username == dto.Username);
        if (exists)
            throw new Exception("Používateľ už existuje");

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = UserRole.User,
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();

        return user;
    }

    public async Task<(string accessToken, RefreshToken refreshToken)> LoginAsync(LoginDto dto)
    {
        var user = await dbContext.Users
            .Include(x => x.RefreshTokens)
            .FirstOrDefaultAsync(x => x.Username == dto.Username);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new Exception("Neplatné prihlasovacie údaje");

        var accessToken = GenerateAccessToken(user);

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        dbContext.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync();

        return (accessToken, refreshToken);
    }

    public async Task<(string accessToken, RefreshToken refreshToken)> RefreshAsync(string token)
    {
        var refreshToken = await dbContext.RefreshTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x =>
                x.Token == token &&
                !x.IsRevoked &&
                x.ExpiresAt > DateTime.UtcNow);

        if (refreshToken is null)
            throw new Exception("Neplatný refresh token");

        refreshToken.IsRevoked = true;

        var newRefresh = new RefreshToken
        {
            UserId = refreshToken.UserId,
            Token = GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        dbContext.RefreshTokens.Add(newRefresh);

        var accessToken = GenerateAccessToken(refreshToken.User);
        await dbContext.SaveChangesAsync();

        return (accessToken, newRefresh);
    }

    public async Task RevokeRefreshTokenAsync(string token)
    {
        var refreshToken = await dbContext.RefreshTokens
            .FirstOrDefaultAsync(x => x.Token == token);

        if (refreshToken != null)
        {
            refreshToken.IsRevoked = true;
            await dbContext.SaveChangesAsync();
        }
    }

    private string GenerateAccessToken(User user)
    {
        var claims = new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
        };

        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!)
        );

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(double.Parse(configuration["Jwt:ExpirationMinutes"]!)),
            signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private static string GenerateRefreshToken()
        => Convert.ToBase64String(RandomNumberGenerator.GetBytes(64));
}
