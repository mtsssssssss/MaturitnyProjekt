using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Data;

namespace backend.Entities;


[Table("user_answer", Schema = "tests")]
public class UserAnswer
{
    [Key]
    public Guid Id { get; set; }

    public Guid TestId { get; set; }
    public Test Test { get; set; } = null!;

    public TestQuestion TestQuestion { get; set; } = null!;

    // ABCD
    public Guid? SelectedAbcdAnswerId { get; set; }
    public AbcdQuestionAnswer? SelectedAbcdAnswer { get; set; }

    // Writing
    public string? WrittenAnswer { get; set; }

    public bool IsCorrect { get; set; }

}
