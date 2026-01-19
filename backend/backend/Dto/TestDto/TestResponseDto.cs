using backend.Entities;


namespace backend.Dto.TestDto;


public sealed class TestResponseDto
{
    public Guid Id { get; set; }
    public int Time {  get; set; }
    public ICollection<TestQuestion> TestQuestions { get; set; } = new List<TestQuestion>();


    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;

}
