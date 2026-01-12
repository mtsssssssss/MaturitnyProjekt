using System.ComponentModel.DataAnnotations;

namespace backend.Entities;

public class user
{
    [Key]
    public Guid Id {  get; set; }

    [Required, MinLength(3)]
    public string UserName { get; set; }

    [Required   ]
    public string PasswordHash { get; set; }

}

public class User
{
    [Key]
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Role { get; set; } = "User";
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryDate { get; set; }
}
