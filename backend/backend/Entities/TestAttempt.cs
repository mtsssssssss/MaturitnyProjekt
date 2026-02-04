using System.ComponentModel.DataAnnotations.Schema;
using backend.Data;

namespace backend.Entities;


public enum TestStatus
{
    Created = 1,
    InProgress = 2,
    Finished = 3,
}


[Table("test_attempt", Schema = "tests")]
public class TestAttempt
{
    public Guid Id { get; set; }
    public string AttemptName { get; set; } = string.Empty;
    public DateTime? TestStarted { get; set; }
    public DateTime? TestFinished { get; set; }
    public TestStatus TestStatus { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public decimal TotalScorePercentage { get; set; }

    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid TestId { get; set; }
    public Test Test { get; set; } = null!;

    public ICollection<TestAttemptUserAnswer> UserAnswers { get; set; } = new List<TestAttemptUserAnswer>();
}


public class TestAttemptUserAnswer
{
    public Guid Id { get; set; }

    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;

    public string UserAnswer { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }

    public Guid TestAttemptId { get; set; }
    public TestAttempt TestAttempt { get; set; } = null!;

}