namespace backend.Dto.TestDto;

public sealed class SubmitAnswerDto
{
    public Guid TestAttemptId { get; set; }
    public Guid QuestionId { get; set; }
    
    public Guid? SelectedAbcdAnswerId { get; set; }

    public string? WrittenAnswer { get; set; }
}
