using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Data;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Hosting;

namespace backend.Entities;

[Table("subject", Schema = "subjects")]
public sealed class Subject
{
    [Key]
    public Guid Id { get; set; }

    [MaxLength(100)]
    [Required]
    public string SubjectName { get; set; } = string.Empty;

    // presna dlzka tri znaky nastavena vo fluentapi
    [Required]
    public string SubjectAbbrev { get; set; } = string.Empty;

    public ICollection<Question> Questions { get; } = new List<Question>();

}
