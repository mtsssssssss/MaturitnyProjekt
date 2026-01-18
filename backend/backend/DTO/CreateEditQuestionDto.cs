using System.ComponentModel.DataAnnotations;
using backend.Data;

namespace backend.DTO;

public sealed class CreateEditQuestionDto
{
    [Required, MinLength(5), MaxLength(1000)]
    public string QuestionText { get; set; } = string.Empty;
    
    [Required]
    public Guid SubjectId { get; set; }
    
    [Required]
    public QuestionType QuestionType { get; set; }

    public List<CreateEditAbcdAnswerDto>? AbcdAnswers { get; set; }
    
    public string? Answer { get; set; }
}

public class CreateEditAbcdAnswerDto
{
    [Required]
    public string Answer { get; set; } = string.Empty;
    
    [Required]
    public bool IsRight { get; set; }
}
