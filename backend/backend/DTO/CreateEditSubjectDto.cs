using System.ComponentModel.DataAnnotations;

namespace backend.DTO;

public class CreateEditSubjectDto
{
    public required string SubjectName { get; set; } = string.Empty;

    [MinLength(3), MaxLength(3)]
    public required string SubjectAbbrev { get; set; } = string.Empty;

}
