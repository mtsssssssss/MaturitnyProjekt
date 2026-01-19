using System.ComponentModel.DataAnnotations;

namespace backend.Dto.SubjectDto;

public class CreateEditSubjectDto
{
    [Required, MinLength(1)]
    public string SubjectName { get; set; } = string.Empty;

    [Required, MinLength(3), MaxLength(3)]
    public string SubjectAbbrev { get; set; } = string.Empty;

}
