using backend.Dto.SubjectDto;

namespace backend.Services;

public interface ISubjectsService
{
    Task<SubjectResponseDto> CreateSubjectAsync(CreateEditSubjectDto dto);
    Task<List<SubjectResponseDto>> GetSubjectsListAsync();
    Task<SubjectResponseDto> GetSubjectByIdAsync(Guid id);
    Task<SubjectResponseDto> UpdateSubjectAsync(Guid id, CreateEditSubjectDto dto);
    Task DeleteSubjectAsync(Guid id);
}
