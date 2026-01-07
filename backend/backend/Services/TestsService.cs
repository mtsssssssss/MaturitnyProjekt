using backend.Data;
using backend.DTO;
using backend.Entities;

namespace backend.Services;

public class TestsService
{
    private readonly AppDbContext dbContext;
    public TestsService(AppDbContext dbContext) 
    {
        this.dbContext = dbContext;
    }
    public string CreateTest(CreateTestDto dto)
    {
        var subjectId = dto.SubjectId;

        // https://stackoverflow.com/questions/7781893/ef-code-first-how-to-get-random-rows

        
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
