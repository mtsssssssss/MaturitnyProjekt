using backend.Data;

namespace backend.DTO;

public sealed class QuestionDto
{
    public string QuestionText { get; set; } = string.Empty;
    public Guid SubjectId { get; set; }
    public QuestionType QuestionType { get; set; }

    
    public List<AbcdAnswerDto>? AbcdAnswers { get; set; }
    public string? Answer { get; set; }
}

public class AbcdAnswerDto
{
    public string Answer { get; set; } = string.Empty;
    public bool IsRight { get; set; }
}

