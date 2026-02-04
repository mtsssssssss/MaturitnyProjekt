using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Data;
using backend.Entities;
using backend.Enums;


[Table("question", Schema = "questions")]
public abstract class Question
{
    public Guid Id { get; set; }

    [MaxLength(1000)]
    public string QuestionText { get; set; } = string.Empty;
    public QuestionType QuestionType { get; set; }

    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;

    public ICollection<TestQuestion> TestQuestions { get; set; } = new List<TestQuestion>();
}


public sealed class AbcdQuestion : Question
{
    public ICollection<AbcdQuestionAnswer> AbcdQuestionAnswers { get; set; } = new List<AbcdQuestionAnswer>();
}


public sealed class WritingQuestion : Question
{
    public string Answer { get; set; } = string.Empty;
}