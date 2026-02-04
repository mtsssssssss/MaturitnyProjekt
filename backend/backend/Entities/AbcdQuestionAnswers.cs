using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Entities;


[Table("abcd_question_answer", Schema = "questions")]
public sealed class AbcdQuestionAnswer
{
    public Guid Id { get; set; }
    public string Answer { get; set; } = string.Empty;
    public bool IsRight { get; set; }

    public Guid AbcdQuestionId { get; set; }
    public AbcdQuestion AbcdQuestion { get; set; } = null!;

}
