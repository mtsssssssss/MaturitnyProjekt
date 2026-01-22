using System.ComponentModel.DataAnnotations;

namespace backend.Dto.AuthDto;

public class RegisterDto
{
    [MinLength(3)]
    public string Username { get; set; } = string.Empty;

    [MaxLength(100)]
    public string FirstName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string LastName { get; set; } = string.Empty;

    [MinLength(6)]
    public string Password { get; set; } = string.Empty;
}
