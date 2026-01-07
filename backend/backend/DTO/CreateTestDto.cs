using System.ComponentModel.DataAnnotations;

namespace backend.DTO;

public class CreateTestDto
{
    [Range(1, 60)]
    public int Time { get; set;}
    public Guid SubjectId { get; set;}

}
