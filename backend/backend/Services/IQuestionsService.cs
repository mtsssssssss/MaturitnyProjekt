using backend.Dto.QuestionDto;
using backend.Dto.SubjectDto;

namespace backend.Services;

public interface IQuestionsService
{
    Task<List<QuestionResponseDto>> CreateQuestionsBulkAsync(IEnumerable<CreateEditQuestionDto> dtos);
    Task<QuestionResponseDto> CreateQuestionAsync(CreateEditQuestionDto dto);
    Task<List<QuestionResponseDto>> GetQuestionsListAsync();
    Task<QuestionResponseDto> GetQuestionByIdAsync(Guid id);
    Task<QuestionResponseDto> EditQuestionAsync(Guid id, CreateEditQuestionDto dto);
    Task DeleteQuestionAsync(Guid id);
}
