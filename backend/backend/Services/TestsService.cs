using System.Security.Claims;
using backend.Data;
using backend.Dto.TestDto;
using backend.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TestsService
{
    private readonly AppDbContext dbContext;
    public TestsService(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }


    public async Task<Guid> CreateTest(Guid userId, CreateRandomTestDto dto)
    {

        // https://stackoverflow.com/questions/7781893/ef-code-first-how-to-get-random-rows

        var randomQuestions = await dbContext.Questions
            .Where(q => q.SubjectId == dto.SubjectId)
            .OrderBy(r => Guid.NewGuid())
            .Take(30)
            .ToListAsync();


        var generatedTest = new Test
        {
            UserId = userId,
            SubjectId = dto.SubjectId,
            Time = dto.Time,
            TestQuestions = randomQuestions.Select(q => new TestQuestion
            {
                QuestionId = q.Id
            }).ToList()
        };

        dbContext.Tests.Add(generatedTest);
        await dbContext.SaveChangesAsync();

        return generatedTest.Id;
    }

    public sealed class StartTestResponseDto
    {
        public Guid Id { get; set; }
        public Guid SubjectId { get; set; }
        public int Time { get; set; }

        public List<QuestionResponseDto> Questions { get; set; } = [];
    }
    public sealed class QuestionResponseDto
    {
        public Guid Id { get; set; }
        public string QuestionText { get; set; } = string.Empty;
        public QuestionType Type { get; set; }

        public List<AbcdAnswerResponseDto>? Answers { get; set; }
    }
    public sealed class AbcdAnswerResponseDto
    {
        public Guid Id { get; set; }
        public string Answer { get; set; } = string.Empty;
    }



    public async Task<StartTestResponseDto> StartTest(Guid userId, Guid testId)
    {
        var test = await dbContext.Tests
            .Where(t => t.Id == testId && t.UserId == userId)
            .Select(t => new StartTestResponseDto
            {
                Id = t.Id,
                SubjectId = t.SubjectId,
                Time = t.Time,

                Questions = t.TestQuestions
                    .Select(tq => tq.Question)
                    .Select(q => new QuestionResponseDto
                    {
                        Id = q.Id,
                        QuestionText = q.QuestionText,
                        Type = EF.Property<QuestionType>(q, "QuestionType"),

                        Answers = q is AbcdQuestion
                            ? ((AbcdQuestion)q).AbcdQuestionAnswers
                                .Select(a => new AbcdAnswerResponseDto
                                {
                                    Id = a.Id,
                                    Answer = a.Answer
                                })
                                .ToList()
                            : null
                    })
                    .ToList()
            })
            .FirstOrDefaultAsync();

        if (test is null)
            throw new Exception("Test neexistuje alebo nepatrí používateľovi");

        return test;
    }


}
