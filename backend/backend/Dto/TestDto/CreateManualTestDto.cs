namespace backend.Dto.TestDto;

public sealed class CreateManualTestDto
{
    public string TestName { get; set; } = string.Empty;
    public string TestDescription { get; set; } = string.Empty;
    public int TimeLimitMinutes { get; set; }

    public Guid SubjectId { get; set; }

    public List<Guid> QuestionIds { get; set; } = [];

    public List<Guid> AssignedUserIds { get; set; } = [];
}

