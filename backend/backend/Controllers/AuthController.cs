using backend.Dto.AuthDto;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using System.Threading.Tasks;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public sealed class AuthController : ControllerBase
{
    private readonly IAuthService authService;

    public AuthController(IAuthService authService)
    {
        this.authService = authService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterDto dto)
    {
        await authService.RegisterAsync(dto);
        return Ok();
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var (accessToken, refreshToken) = await authService.LoginAsync(dto);

        SetCookies(accessToken, refreshToken.Token, refreshToken.ExpiresAt);
        return Ok();
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> Refresh()
    {
        if (!Request.Cookies.TryGetValue("refresh_token", out var token))
            return Unauthorized();

        var (accessToken, newRefresh) = await authService.RefreshAsync(token);

        SetCookies(accessToken, newRefresh.Token, newRefresh.ExpiresAt);
        return Ok();
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        if (Request.Cookies.TryGetValue("refresh_token", out var token))
            await authService.RevokeRefreshTokenAsync(token);

        Response.Cookies.Delete("access_token");
        Response.Cookies.Delete("refresh_token");

        return Ok();
    }

    [Authorize]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(new UserResponseDto
        {
            Id = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!),
            Username = User.FindFirstValue(ClaimTypes.Name)!,
            Role = User.FindFirstValue(ClaimTypes.Role)!,
        });
    }

    [Authorize]
    [HttpGet("full-user-info")]
    public async Task<IActionResult> GetFullUserInfo()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

        var userInfo = await authService.GetFullUserInfo(userId);
        return Ok(userInfo);
    }

    private void SetCookies(string access, string refresh, DateTime refreshExpiry)
    {
        Response.Cookies.Append("access_token", access, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = DateTime.UtcNow.AddMinutes(15)    
        });

        Response.Cookies.Append("refresh_token", refresh, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.Strict,
            Expires = refreshExpiry
        });
    }
}
