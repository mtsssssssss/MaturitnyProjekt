using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Enums;

namespace backend.Entities;


[Table("user", Schema = "auth")]
public sealed class User
{
    public Guid Id { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;

    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public UserRole Role { get; set; } = UserRole.User;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;


    public ICollection<RefreshToken> RefreshTokens { get; set; } = new List<RefreshToken>();

    public ICollection<Test> Tests { get; set; } = new List<Test>();

    public ICollection<TestAssignment> TestAssignments { get; set; } = new List<TestAssignment>();
    public ICollection<TestAssignment> AssignedTests { get; set; } = new List<TestAssignment>();
}

