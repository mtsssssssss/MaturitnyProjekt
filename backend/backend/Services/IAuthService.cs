using backend.DTO;
using backend.Entities;

namespace backend.Services;

public interface IAuthService
{
    Task<User> RegisterAsync(RegisterDto dto);

    Task<(string accessToken, RefreshToken refreshToken)> LoginAsync(LoginDto dto);

    Task<(string accessToken, RefreshToken refreshToken)> RefreshAsync(string token);

    Task RevokeRefreshTokenAsync(string token);
}
