using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Entities;


[Table("test", Schema = "tests")]
public sealed class Test
{
    [Key]
    public Guid Id { get; set; }

    /*
    // ----- TODO ----- //
    public string? TestName = null;
    public string? TestDescription = null;
    */

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public int Time { get; set; }

    public ICollection<TestQuestion> TestQuestions { get; set; } = new List<TestQuestion>();

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;

}
