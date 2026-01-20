using backend.Data;

namespace backend.Dto.TestDto;

public sealed class StartTestResponseDto
{
    public Guid Id { get; set; }
    public Guid SubjectId { get; set; }
    public int Time { get; set; }

    public List<QuestionResponseDto> Questions { get; set; } = [];
}
public sealed class QuestionResponseDto
{
    public Guid Id { get; set; }
    public string QuestionText { get; set; } = string.Empty;
    public QuestionType Type { get; set; }

    public List<AbcdAnswerResponseDto>? Answers { get; set; }
}
public sealed class AbcdAnswerResponseDto
{
    public Guid Id { get; set; }
    public string Answer { get; set; } = string.Empty;
}