using backend.Enums;

namespace backend.Dto.QuestionDto;

public sealed class CreateEditQuestionDto
{
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
