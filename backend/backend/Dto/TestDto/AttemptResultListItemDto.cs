namespace backend.Dto.TestDto;

public class AttemptResultListItemDto
{
    public Guid TestAttemptId { get; set; }
    public Guid TestId { get; set; }
    public string TestName { get; set; } = string.Empty;
    public DateTime? TestStarted { get; set; }
    public DateTime? TestFinished { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public decimal TotalScorePercentage { get; set; }
}

public sealed class StudentAttemptResultListItemDto : AttemptResultListItemDto
{
    public Guid UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
}

