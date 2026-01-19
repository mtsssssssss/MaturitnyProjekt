using System.ComponentModel.DataAnnotations;

namespace backend.Dto.TestDto;

public class CreateRandomTestDto
{
    [Range(1, 60)]
    public int Time { get; set;}
    public Guid SubjectId { get; set;}

}
