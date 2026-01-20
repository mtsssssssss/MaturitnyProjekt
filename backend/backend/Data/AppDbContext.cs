using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }


    public DbSet<Subject> Subjects { get; set; }
    public DbSet<Question> Questions { get; set; }
    public DbSet<AbcdQuestionAnswer> AbcdQuestionAnswers { get; set; }


    public DbSet<Test> Tests { get; set; }
    public DbSet<TestQuestion> TestQuestions { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // TPH
        // https://learn.microsoft.com/en-us/ef/core/modeling/inheritance#table-per-hierarchy-and-discriminator-configuration - link na dokumentaciu

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();


        modelBuilder.Entity<User>()
        .Property(u => u.Role)
        .HasConversion<string>();

        modelBuilder.Entity<RefreshToken>()
            .HasIndex(r => r.Token)
            .IsUnique();

        modelBuilder.Entity<User>()
            .HasMany(x => x.RefreshTokens)
            .WithOne(x => x.User)
            .OnDelete(DeleteBehavior.Cascade);


        modelBuilder.Entity<Subject>()
            .Property(x => x.SubjectAbbrev)
            .HasColumnType("char(3)");

        modelBuilder.Entity<Subject>()
            .HasIndex(i => i.SubjectAbbrev)
            .IsUnique(true);

        // Question TPH konfuiguracia
        modelBuilder.Entity<Question>()
            .HasDiscriminator<QuestionType>("QuestionType")
            .HasValue<AbcdQuestion>(QuestionType.Abcd)
            .HasValue<WritingQuestion>(QuestionType.Writing);

        modelBuilder.Entity<Question>()
            .Property(u => u.QuestionType)
            .HasConversion<string>();


        modelBuilder.Entity<Question>()
            .HasOne(q => q.Subject)
            .WithMany(q => q.Questions)
            .HasForeignKey(q => q.SubjectId)
            .OnDelete(DeleteBehavior.Cascade);


        modelBuilder.Entity<AbcdQuestionAnswer>()
            .HasOne(q => q.AbcdQuestion)
            .WithMany(q => q.AbcdQuestionAnswers)
            .HasForeignKey(fk => fk.AbcdQuestionId)
            .OnDelete(DeleteBehavior.Cascade);


        modelBuilder.Entity<Test>()
        .Property(t => t.TestStatus)
        .HasConversion<string>();

        modelBuilder.Entity<TestQuestion>()
            .HasKey(tq => new { tq.TestId, tq.QuestionId }); 


        modelBuilder.Entity<TestQuestion>()
            .HasOne(tq => tq.Test)
            .WithMany(t => t.TestQuestions)
            .HasForeignKey(tq => tq.TestId);


        modelBuilder.Entity<TestQuestion>()
            .HasOne(tq => tq.Question)
            .WithMany(q => q.TestQuestions)
            .HasForeignKey(tq => tq.QuestionId);
    }

}

public enum QuestionType
{
    Abcd = 1,
    Writing = 2
}

[Table("question", Schema = "questions")]
public abstract class Question
{
    [Key]
    public Guid Id { get; set; }

    [MaxLength(1000)]
    public string QuestionText { get; set; } = string.Empty;

    public QuestionType QuestionType { get; set; }

    // Subject - FK
    public Guid SubjectId { get; set; }
    public Subject Subject { get; set; } = null!;

    // Tests - FK
    public ICollection<TestQuestion> TestQuestions { get; set; } = new List<TestQuestion>();
}


public sealed class AbcdQuestion : Question
{
    public ICollection<AbcdQuestionAnswer> AbcdQuestionAnswers { get; set; } = new List<AbcdQuestionAnswer>();
}


public sealed class WritingQuestion : Question
{
    public string Answer { get; set; } = string.Empty;
}


[Table("abcd_question_answer", Schema = "questions")]
public sealed class AbcdQuestionAnswer
{
    [Key]
    public Guid Id { get; set; }

    [Required]
    public string Answer { get; set; } = string.Empty;

    [Required]
    public bool IsRight { get; set; }

    // AbcdQuestion - FK
    public Guid AbcdQuestionId { get; set; }
    public AbcdQuestion AbcdQuestion { get; set; } = null!;

}
