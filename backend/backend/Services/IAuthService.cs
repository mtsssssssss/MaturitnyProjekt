using backend.Dto.AuthDto;

namespace backend.Services;

public interface IAuthService
{
    Task RegisterAsync(RegisterDto dto);
    Task<TokenResult> LoginAsync(LoginDto dto);
    Task<TokenResult> RefreshAsync(string token);
    Task RevokeRefreshTokenAsync(string token);
    Task<UserFullInfoResponseDto> GetFullUserInfo(Guid userId);
}
