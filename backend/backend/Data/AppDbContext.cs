using backend.Entities;
using backend.Enums;
using Microsoft.EntityFrameworkCore;

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
    public DbSet<TestAssignment> TestAssignments { get; set; }
    public DbSet<TestAttempt> TestAttempts { get; set; }
    public DbSet<TestAttemptUserAnswer> TestAttemptUserAnswers { get; set; }



    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);


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

        // Question TPH konfuiguracia - https://learn.microsoft.com/en-us/ef/core/modeling/inheritance
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

        modelBuilder.Entity<TestAttempt>()
        .Property(t => t.TestStatus)
        .HasConversion<string>();

        modelBuilder.Entity<TestAttemptUserAnswer>()
            .HasIndex(t =>  new { t.TestAttemptId, t.QuestionId})
            .IsUnique();

        modelBuilder.Entity<TestAssignment>()
            .HasIndex(a => new { a.TestId, a.UserId })
            .IsUnique();

        modelBuilder.Entity<TestAssignment>()
            .HasOne(a => a.Test)
            .WithMany(t => t.TestAssignments)
            .HasForeignKey(a => a.TestId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TestAssignment>()
            .HasOne(a => a.User)
            .WithMany(u => u.TestAssignments)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<TestAssignment>()
            .HasOne(a => a.AssignedByUser)
            .WithMany(u => u.AssignedTests)
            .HasForeignKey(a => a.AssignedByUserId)
            .OnDelete(DeleteBehavior.Restrict);
    }

}
