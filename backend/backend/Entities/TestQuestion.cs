using System.ComponentModel.DataAnnotations.Schema;
using backend.Data;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Entities;

[Table("test_question", Schema = "tests")]
public sealed class TestQuestion
{
    public Guid TestId { get; set; }
    public Test Test { get; set; } = null!;

    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
}
