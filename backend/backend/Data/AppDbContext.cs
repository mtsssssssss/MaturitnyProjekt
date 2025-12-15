using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<Subject> Subjects { get; set; }
    public DbSet<AbcdQuestion> AbcdQuestions { get; set; }
    public DbSet<WritingQuestion> WritingQuestions { get; set; }
    public DbSet<AbcdQuestionAnswer> AbcdQuestionAnswers { get; set; }

    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Table-per-concrete-type configuration - vytvori pre kazdy datovy typ vlastnu tabulku - nebude miesat
        // https://learn.microsoft.com/en-us/ef/core/modeling/inheritance\ - link na dokumentaciu

        modelBuilder.Entity<Question>().UseTpcMappingStrategy();


        modelBuilder.Entity<Subject>()
            .Property(x => x.SubjectAbbrev)
            .HasColumnType("char(3)");


        modelBuilder.Entity<Question>()
            .HasOne(q => q.Subject)
            .WithMany()
            .HasForeignKey(q => q.SubjectId)
            .OnDelete(DeleteBehavior.Cascade);


        modelBuilder.Entity<AbcdQuestionAnswer>()
            .HasOne(q => q.AbcdQuestion)
            .WithMany(q => q.AbcdQuestionAnswers)
            .HasForeignKey(fk => fk.AbcdQuestionId)
            .OnDelete(DeleteBehavior.Cascade);
    }
    
}

[Table("subject", Schema = "questions")]
public sealed class Subject
{
    [Key]
    public Guid Id { get; set; }

    [MaxLength(100)]
    public required string SubjectName { get; set; } = string.Empty;

    public required string SubjectAbbrev { get; set; } = string.Empty;

}


public abstract class Question
{
    [Key]
    public Guid Id { get; set; } 

    [MaxLength(500)]
    public required string QuestionText { get; set; }
    

    // Subject - FK
    public required Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;

}


[Table("abcd_question", Schema = "questions")]
public sealed class AbcdQuestion : Question
{       
    public ICollection<AbcdQuestionAnswer>? AbcdQuestionAnswers { get; set; } = new List<AbcdQuestionAnswer>();
}


[Table("writing_question", Schema = "questions")]
public sealed class WritingQuestion : Question
{
    public required string Answer { get; set; } = string.Empty;
}


[Table("abcd_question_answer", Schema = "questions")]
public sealed class AbcdQuestionAnswer
{
    [Key]
    public Guid Id { get; set; }
    public required string Answer { get; set; } = string.Empty;
    public required bool IsRight { get; set; }

    // AbcdQuestion - FK
    public Guid AbcdQuestionId { get; set; }
    public AbcdQuestion AbcdQuestion { get; set; } = null!;

}
