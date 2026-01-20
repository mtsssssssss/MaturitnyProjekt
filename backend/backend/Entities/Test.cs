using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Entities;


public enum TestStatus
{
    Created = 1,     
    InProgress = 2,  
    Finished = 3,  
}


[Table("test", Schema = "tests")]
public sealed class Test
{
    [Key]
    public Guid Id { get; set; }

    public string TestName { get; set; } = string.Empty;
    public string TestDescription { get; set; } = string.Empty;
    public int Time { get; set; }

    public DateTime? TestStarted { get; set; }
    public DateTime? TestFinished { get; set; }
    public TestStatus TestStatus { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TestQuestion> TestQuestions { get; set; } = new List<TestQuestion>();

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;

}
