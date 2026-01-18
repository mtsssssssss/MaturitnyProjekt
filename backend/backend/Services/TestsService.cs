using System.Security.Claims;
using backend.Data;
using backend.DTO;
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

    
    public async Task<string> CreateTest(Guid userId, CreateTestDto dto)
    {
        var subjectId = dto.SubjectId;

        

        // https://stackoverflow.com/questions/7781893/ef-code-first-how-to-get-random-rows

        var test = new Test
        {
            UserId = userId,
            SubjectId = subjectId,
            
        };


        var randomQuestions = await dbContext.Questions
            .Where(q => q.SubjectId == subjectId)
            .OrderBy(r => Guid.NewGuid())
            .Take(30)
            .ToListAsync();
        
        /*
        List<AbcdQuestion> abcdQuestions = await dbContext.AbcdQuestions
            .Where(q =>  q.SubjectId == subjectId)
            .OrderBy(r => Guid.NewGuid())
            .Take(abcdQuestionCount)
            .ToListAsync();

        List<WritingQuestion> writingQuestions = await dbContext.WritingQuestions
            .Where(q => q.SubjectId == subjectId)
            .OrderBy(r => Guid.NewGuid())
            .Take(writingQuestionCount)
            .ToListAsync();

        List<Question> questions = abcdQuestions
            .Concat<Question>(writingQuestions)
            .ToList();

        */
        


        Test generatedTest = new Test
        {
            
        };

        return "";
    }


}
