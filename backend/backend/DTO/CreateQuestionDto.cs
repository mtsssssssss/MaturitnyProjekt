using System.ComponentModel.DataAnnotations;
using backend.Data;

namespace backend.DTO;


public sealed class CreateQuestionDto
{
    [MinLength(5), MaxLength(1000), Required]
    public string QuestionText { get; set; } = string.Empty;
    [Required]
    public Guid SubjectId { get; set; }
    [Required]
    public QuestionType QuestionType { get; set; }


    public List<CreateAbcdAnswerDto>? AbcdAnswers { get; set; }
    public string? Answer { get; set; }
}

public class CreateAbcdAnswerDto
{
    public string Answer { get; set; } = string.Empty;
    public bool IsRight { get; set; }
}


