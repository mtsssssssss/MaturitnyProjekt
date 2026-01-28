using backend.Entities;

namespace backend.Dto.AuthDto;

public sealed class TokenResult
{
    public string AccessToken { get; set; } = string.Empty;
    public RefreshToken RefreshToken { get; set; } = null!;
}
