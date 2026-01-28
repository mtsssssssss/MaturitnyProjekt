using backend.Dto.TestDto;

namespace backend.Services;

public interface ITestsService
{
    Task<CreateRandomTestResponseDto> CreateRandomTest(Guid userId, CreateRandomTestDto dto);
    Task<CreateManualTestResponseDto> CreateManualTestAsync(Guid creatorUserId, CreateManualTestDto dto);
    Task<List<AssignedTestListItemDto>> GetAssignedTestsAsync(Guid userId);
    Task<List<AttemptResultListItemDto>> GetMyAttemptsAsync(Guid userId);
    Task<List<StudentAttemptResultListItemDto>> GetStudentAttemptsAsync(Guid teacherUserId);
    Task<StartTestResponseDto> StartTest(Guid userId, Guid testId);
    Task<bool> SubmitAnswer(Guid userId, SubmitAnswerDto dto);
    Task<FinishTestResponseDto> FinishTest(Guid userId, FinishTestDto dto);
}
