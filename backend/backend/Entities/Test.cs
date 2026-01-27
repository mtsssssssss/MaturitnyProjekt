using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Entities;


[Table("test", Schema = "tests")]
public sealed class Test
{
    [Key]
    public Guid Id { get; set; }

    public string TestName { get; set; } = string.Empty;
    public string TestDescription { get; set; } = string.Empty;
    public int TimeLimitMinutes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Guid CreatedByUserId { get; set; }
    public User CreatedByUser { get; set; } = null!;

    public ICollection<TestQuestion> TestQuestions { get; set; } = new List<TestQuestion>();

    /*
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    */

    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;


    public ICollection<TestAttempt> TestAttempts { get; set; } = new List<TestAttempt>();

    public ICollection<TestAssignment> TestAssignments { get; set; } = new List<TestAssignment>();

}
