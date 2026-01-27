namespace backend.Dto.TestDto;

public sealed class FinishTestResponseDto
{
    public Guid TestAttemptId { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public decimal TotalScorePercentage { get; set; }
    public DateTime TestFinished { get; set; }
}
