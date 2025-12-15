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

    public Question CreateQuestion(CreateQuestionDto dto)
    {
        Question question;

        switch (dto.QuestionType)
        {
            case QuestionType.ABCD:
                if (dto.AbcdAnswers == null || !dto.AbcdAnswers.Any())
                    throw new Exception("ABCD otázka musí mať odpovede.");

                var abcdQuestion = new AbcdQuestion
                {
                    QuestionText = dto.QuestionText,
                    SubjectId = dto.SubjectId,
                };

                foreach (var a in dto.AbcdAnswers)
                {
                    abcdQuestion.AbcdQuestionAnswers!.Add(new AbcdQuestionAnswer
                    {
                        Answer = a.Answer,
                        IsRight = a.IsRight,
                        AbcdQuestion = abcdQuestion,
                    });
                }

                question = abcdQuestion;
                break;


            case QuestionType.WRITING:
                if (string.IsNullOrWhiteSpace(dto.Answer))
                    throw new Exception("Writing otázka musí mať odpoveď.");

                var writingQuestion = new WritingQuestion
                {
                    QuestionText = dto.QuestionText,
                    SubjectId = dto.SubjectId,
                    Answer = dto.Answer,
                };
                question = writingQuestion;
                break;

            default:
                throw new Exception("Typ otazky neexistuje.");
                
        }

        dbContext.Add(question);
        dbContext.SaveChanges();

        return question;
    }
}
