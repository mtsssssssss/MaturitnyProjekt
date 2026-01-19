using System.ComponentModel.DataAnnotations;
using backend.Data;

namespace backend.Dto.QuestionDto;

public sealed class CreateEditQuestionDto
{
    [MinLength(5), MaxLength(1000)]
    public string QuestionText { get; set; } = string.Empty;
    public Guid SubjectId { get; set; }
    public QuestionType QuestionType { get; set; }


    public List<CreateEditAbcdAnswerDto>? AbcdAnswers { get; set; } = null;    
    public string? Answer { get; set; }
}

public class CreateEditAbcdAnswerDto
{
    public string Answer { get; set; } = string.Empty;
    public bool IsRight { get; set; }
}
