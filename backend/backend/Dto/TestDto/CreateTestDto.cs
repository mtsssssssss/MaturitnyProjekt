using backend.Data;
using backend.Entities;

namespace backend.Dto.TestDto;


public class CreateTestDto
{
    public string TestName { get; set; } = string.Empty;
    public string TestDescription { get; set; } = string.Empty;
    public int TimeLimitMinutes { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public ICollection<CreateTestQuestionDto> TestQuestions { get; set; } = new List<CreateTestQuestionDto>();

    /*
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    */

    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;

}


public sealed class CreateTestQuestionDto
{
    public Guid TestId { get; set; }
    public Test Test { get; set; } = null!;

    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;
}
