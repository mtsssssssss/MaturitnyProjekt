using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Entities;

[Table("subject", Schema = "subjects")]
public sealed class Subject
{
    public Guid Id { get; set; }

    [MaxLength(100)]
    public string SubjectName { get; set; } = string.Empty;
    public string SubjectAbbrev { get; set; } = string.Empty;

    public ICollection<Question> Questions { get; } = new List<Question>();

}
