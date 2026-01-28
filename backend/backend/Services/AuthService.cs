using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using backend.Data;
using backend.Dto.AuthDto;
using backend.Entities;
using backend.Exceptions;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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

    public async Task RegisterAsync(RegisterDto dto)
    {
        var exists = await dbContext.Users.AnyAsync(x => x.Username == dto.Username);
        if (exists)
            throw new ConflictException("Používateľ už existuje.");

        var user = new User
        {
            Username = dto.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Role = UserRole.User,
        };

        dbContext.Users.Add(user);
        await dbContext.SaveChangesAsync();
    }

    public async Task<TokenResult> LoginAsync(LoginDto dto)
    {
        var user = await dbContext.Users
            .Include(x => x.RefreshTokens)
            .FirstOrDefaultAsync(x => x.Username == dto.Username);

        if (user is null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash))
            throw new UnauthorizedException("Neplatné prihlasovacie údaje.");

        var accessToken = GenerateAccessToken(user);
        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = GenerateRefreshToken(),
            ExpiresAt = DateTime.UtcNow.AddDays(7)
        };

        dbContext.RefreshTokens.Add(refreshToken);
        await dbContext.SaveChangesAsync();

        return new TokenResult { AccessToken = accessToken, RefreshToken = refreshToken };
    }

    public async Task<TokenResult> RefreshAsync(string token)
    {
        var refreshToken = await dbContext.RefreshTokens
            .Include(x => x.User)
            .FirstOrDefaultAsync(x =>
                x.Token == token &&
                !x.IsRevoked &&
                x.ExpiresAt > DateTime.UtcNow);

        if (refreshToken is null)
            throw new UnauthorizedException("Neplatný refresh token.");

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

        return new TokenResult { AccessToken = accessToken, RefreshToken = newRefresh };
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
        else
        {
            throw new NotFoundException("Refresh token neexistuje.");
        }
    }

    public async Task<UserFullInfoResponseDto> GetFullUserInfo(Guid userId)
    {
        var user = await dbContext.Users
            .Where(x => x.Id == userId)
            .FirstOrDefaultAsync();

        return MapToResponseDto(user!);
    }

    private UserFullInfoResponseDto MapToResponseDto(User user)
    {
        var dto = new UserFullInfoResponseDto
        {
            Id = user.Id,
            Username = user.Username,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Fullname = user.FirstName + " " + user.LastName,
            Role = user.Role.ToString(),
        };

        return dto;
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
