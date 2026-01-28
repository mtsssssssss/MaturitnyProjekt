using backend.Entities;

namespace backend.Dto.TestDto;

public sealed class AssignedTestListItemDto
{
    public Guid TestId { get; set; }
    public string TestName { get; set; } = string.Empty;
    public string TestDescription { get; set; } = string.Empty;
    public string SubjectName { get; set; } = string.Empty;
    public int TimeLimitMinutes { get; set; }
    public DateTime AssignedAt { get; set; }
}

