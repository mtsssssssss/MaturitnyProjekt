using backend.Data;

namespace backend.DTO;

public sealed class QuestionResponseDto
{
    public Guid Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public Guid SubjectId { get; set; }
    public QuestionType QuestionType { get; set; }
    
    public List<AbcdAnswerResponseDto>? AbcdAnswers { get; set; }
    public string? Answer { get; set; }
}

public class AbcdAnswerResponseDto
{
    public Guid Id { get; set; }
    public string Answer { get; set; } = string.Empty;
    public bool IsRight { get; set; }
}
