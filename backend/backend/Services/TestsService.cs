using backend.Data;
using backend.Dto.TestDto;
using backend.Entities;
using backend.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TestsService
{
    private readonly AppDbContext dbContext;
    public TestsService(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }


    public async Task<CreateRandomTestResponseDto> CreateRandomTest(Guid userId, CreateRandomTestDto dto)
    {

        // https://stackoverflow.com/questions/7781893/ef-code-first-how-to-get-random-rows
        var subject = await dbContext.Subjects.FirstOrDefaultAsync(s => s.Id == dto.SubjectId);

        if (subject == null)
            throw new NotFoundException("Predmet neexistuje.");

        var randomQuestions = await dbContext.Questions
            .Where(q => q.SubjectId == dto.SubjectId)
            .OrderBy(r => Guid.NewGuid())
            .Take(30)
            .ToListAsync();


        var generatedTest = new Test
        {
            UserId = userId,
            SubjectId = dto.SubjectId,
            TestName = subject.SubjectAbbrev + " Test",
            TestDescription = "Prípravný test z predmetu " + subject.SubjectName,
            TestStatus = TestStatus.Created,
            Time = dto.Time,
            TestQuestions = randomQuestions.Select(q => new TestQuestion
            {
                QuestionId = q.Id
            }).ToList()
        };

        dbContext.Tests.Add(generatedTest);
        await dbContext.SaveChangesAsync();

        return new CreateRandomTestResponseDto
        {
            Id = generatedTest.Id,
        };
    }
     


    public async Task<StartTestResponseDto> StartTest(Guid userId, Guid testId)
    {
        var test = await dbContext.Tests
            .FirstOrDefaultAsync(t => t.Id == testId && t.UserId == userId);

        if (test == null)
            throw new NotFoundException("Test neexistuje alebo nepatrí používateľovi");

        if (test.TestStatus != TestStatus.Created)
            throw new ForbiddenException("Test už bol spustený");

        test.TestStarted = DateTime.UtcNow;
        test.TestStatus = TestStatus.InProgress;

        await dbContext.SaveChangesAsync();



        var testResponse = await dbContext.Tests
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

        if (testResponse is null)
            throw new Exception("Test neexistuje alebo nepatrí používateľovi");

        return testResponse;
    }


}
