using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Entities;

// ***** TESTY *****

[Table("test", Schema = "tests")]
public sealed class Test
{
    [Key]
    public Guid Id { get; set; }


    [Required]
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<TestQuestion> TestQuestions { get; set; } = new List<TestQuestion>();

}
