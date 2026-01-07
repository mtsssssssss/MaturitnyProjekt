using System.Reflection.Metadata.Ecma335;
using backend.Data;
using backend.DTO;

namespace backend.Services;

public sealed class QuestionsService
{
    private readonly AppDbContext dbContext;

    public QuestionsService(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }
    /*
    public QuestionDto CreateQuestion(QuestionDto dto)
    {

        string writingQuestionAnswer = null;
        var abcdQuestionanswer = new List<AbcdQuestionAnswer>();
        
        if(dto.QuestionType == QuestionType.Writing)
        {
            dto.
        }
        
        var question = new Question 
        { 
            QuestionText = dto.QuestionText,
            SubjectId = dto.SubjectId,

            

        };
    

        
        Question question1 = dto.QuestionType switch
        {
            QuestionType.Abcd => new AbcdQuestion
            {
                QuestionText = dto.QuestionText,
                SubjectId = dto.SubjectId,
                AbcdQuestionAnswers = dto.AbcdAnswers?.Select(a => new AbcdQuestionAnswer
                {
                    Answer = a.Answer,
                    IsRight = a.IsRight
                }).ToList() ?? new List<AbcdQuestionAnswer>()
            },
            QuestionType.Writing => new WritingQuestion
            {
                QuestionText = dto.QuestionText,
                SubjectId = dto.SubjectId,
                Answer = dto.Answer ?? throw new Exception("Writing otázka musí mať odpoveď.")
            },
            _ => throw new Exception("Typ otázky neexistuje.")
        };

        // Overenie, že ABCD má odpovede
        if (question is AbcdQuestion aq)
        {
            if (!aq.AbcdQuestionAnswers.Any())
                throw new Exception("ABCD otázka musí mať odpovede.");

            if (aq.AbcdQuestionAnswers.Count(a => a.IsRight) != 1)
                throw new Exception("ABCD otázka musí mať **presne jednu správnu odpoveď**.");
        }

        dbContext.Add(question);
        dbContext.SaveChanges();

        return new QuestionDto
        {
            // Id = question.Id,
            QuestionText = question.QuestionText,
            SubjectId = question.SubjectId,
            QuestionType = question.QuestionType,
            Answer = (question as WritingQuestion)?.Answer,
            AbcdAnswers = (question as AbcdQuestion)?.AbcdQuestionAnswers
                .Select(a => new AbcdAnswerDto { Answer = a.Answer, IsRight = a.IsRight })
                .ToList()
        };
    }*/


}
