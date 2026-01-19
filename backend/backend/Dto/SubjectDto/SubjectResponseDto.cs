namespace backend.Dto.SubjectDto;

public class SubjectResponseDto
{
    public Guid Id {  get; set; }
    public string SubjectName { get; set; } = string.Empty;
    public string SubjectAbbrev { get; set; } = string.Empty;

}
