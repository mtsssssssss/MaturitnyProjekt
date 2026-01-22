namespace backend.Dto.AuthDto;

public class UserFullInfoResponseDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Fullname { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}
