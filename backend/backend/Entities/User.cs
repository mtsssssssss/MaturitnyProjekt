using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

public enum UserRole
{
    User = 1,
    Teacher = 2,
    Admin = 3,
}


[Table("user", Schema = "auth")]
public sealed class User
{
    public Guid Id { get; set; }


    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;

    public UserRole Role { get; set; } = UserRole.User;


    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public ICollection<Test> Tests { get; set; } = new List<Test>();
}

