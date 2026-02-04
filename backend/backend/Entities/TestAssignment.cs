using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;

[Table("test_assignment", Schema = "tests")]
public sealed class TestAssignment
{
    public Guid Id { get; set; }
    public Guid TestId { get; set; }
    public Test Test { get; set; } = null!;
    public DateTime AssignedAt { get; set; } = DateTime.UtcNow;

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid AssignedByUserId { get; set; }
    public User AssignedByUser { get; set; } = null!;    
}

