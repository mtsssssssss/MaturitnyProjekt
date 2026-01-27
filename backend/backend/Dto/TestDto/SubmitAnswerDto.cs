namespace backend.Dto.TestDto;

public sealed class SubmitAnswerDto
{
    public Guid TestAttemptId { get; set; }
    public Guid QuestionId { get; set; }
    
    // Pre ABCD otázky
    public Guid? SelectedAbcdAnswerId { get; set; }
    
    // Pre Writing otázky
    public string? WrittenAnswer { get; set; }
}
