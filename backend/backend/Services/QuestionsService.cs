using System.ComponentModel.DataAnnotations;
using backend.Data;
using backend.Dto.QuestionDto;
using backend.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public sealed class QuestionsService
{
    private readonly AppDbContext dbContext;

    public QuestionsService(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<QuestionResponseDto> CreateQuestionAsync(CreateEditQuestionDto dto)
    {
        if (!await dbContext.Subjects.AnyAsync(s => s.Id == dto.SubjectId))
            throw new NotFoundException("Predmet neexistuje.");

        Question question;

        if (dto.QuestionType == QuestionType.Abcd)
        {
            if (dto.AbcdAnswers == null || dto.AbcdAnswers.Count < 2)
                throw new ValidationException("ABCD otázka musí mať minimálne 2 odpovede.");

            if (dto.AbcdAnswers.Count(a => a.IsRight) != 1)
                throw new ValidationException("ABCD otázka musí mať presne jednu správnu odpoveď.");

            question = new AbcdQuestion
            {
                QuestionText = dto.QuestionText,
                SubjectId = dto.SubjectId,
                QuestionType = dto.QuestionType,
                AbcdQuestionAnswers = dto.AbcdAnswers
                    .Select(a => new AbcdQuestionAnswer
                    {
                        Answer = a.Answer,
                        IsRight = a.IsRight
                    })
                    .ToList()
            };
        }
        else if (dto.QuestionType == QuestionType.Writing)
        {
            if (string.IsNullOrWhiteSpace(dto.Answer))
                throw new ValidationException("Písomná otázka musí mať odpoveď.");

            question = new WritingQuestion
            {
                QuestionText = dto.QuestionText,
                SubjectId = dto.SubjectId,
                QuestionType = dto.QuestionType,
                Answer = dto.Answer
            };
        }
        else
        {
            throw new ValidationException("Neplatný typ otázky.");
        }

        await dbContext.Questions.AddAsync(question);
        await dbContext.SaveChangesAsync();

        return MapToResponseDto(question);
    }


    public async Task<List<QuestionResponseDto>> GetQuestionsListAsync()
    {
        /*
        var abcdQuestions = await dbContext.Questions
            .OfType<AbcdQuestion>()
            .Include(q => q.AbcdQuestionAnswers)
            .Include(q => q.Subject)
            .ToListAsync();

        var writingQuestions = await dbContext.Questions
            .OfType<WritingQuestion>()
            .Include(q => q.Subject)
            .ToListAsync();

        var questions = abcdQuestions.Cast<Question>().Concat(writingQuestions).ToList();
        */

        var questions = await dbContext.Questions
            .Include(q => q.Subject)
            .Include(q => (q as AbcdQuestion).AbcdQuestionAnswers)
            .ToListAsync();

        return questions.Select(MapToResponseDto).ToList();
    }


    public async Task<QuestionResponseDto> GetQuestionByIdAsync(Guid id)
    {
        var question = await dbContext.Questions
            .Include(q => q.Subject)
            .Include(q => (q as AbcdQuestion).AbcdQuestionAnswers)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null)
            throw new NotFoundException("Otázka neexistuje.");

        return MapToResponseDto(question);
    }

    public async Task<QuestionResponseDto> EditQuestionAsync(Guid id, CreateEditQuestionDto dto)
    {
        var question = await dbContext.Questions
            .Include(q => q is AbcdQuestion ? ((AbcdQuestion)q).AbcdQuestionAnswers : null)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null)
            throw new NotFoundException("Otázka neexistuje.");

        if (!await dbContext.Subjects.AnyAsync(s => s.Id == dto.SubjectId))
            throw new NotFoundException("Predmet neexistuje.");

        if (question is AbcdQuestion && dto.QuestionType == QuestionType.Writing)
        {
            dbContext.Questions.Remove(question);
            await dbContext.SaveChangesAsync();

            var newQuestion = new WritingQuestion
            {
                QuestionText = dto.QuestionText,
                SubjectId = dto.SubjectId,
                Answer = dto.Answer ?? string.Empty
            };

            await dbContext.Questions.AddAsync(newQuestion);
            await dbContext.SaveChangesAsync();

            return MapToResponseDto(newQuestion);
        }
        else if (question is WritingQuestion && dto.QuestionType == QuestionType.Abcd)
        {
            dbContext.Questions.Remove(question);
            await dbContext.SaveChangesAsync();

            if (dto.AbcdAnswers == null || dto.AbcdAnswers.Count < 2)
                throw new ValidationException("ABCD otázka musí mať minimálne 2 odpovede.");

            if (dto.AbcdAnswers.Count(a => a.IsRight) != 1)
                throw new ValidationException("ABCD otázka musí mať presne jednu správnu odpoveď.");

            var newQuestion = new AbcdQuestion
            {
                QuestionText = dto.QuestionText,
                SubjectId = dto.SubjectId,
                AbcdQuestionAnswers = dto.AbcdAnswers
                    .Select(a => new AbcdQuestionAnswer
                    {
                        Answer = a.Answer,
                        IsRight = a.IsRight
                    })
                    .ToList()
            };

            await dbContext.Questions.AddAsync(newQuestion);
            await dbContext.SaveChangesAsync();

            return MapToResponseDto(newQuestion);
        }
        else
        {
            question.QuestionText = dto.QuestionText;
            question.SubjectId = dto.SubjectId;

            if (question is AbcdQuestion abcdQuestion)
            {
                if (dto.AbcdAnswers == null || dto.AbcdAnswers.Count < 2)
                    throw new ValidationException("ABCD otázka musí mať minimálne 2 odpovede.");

                if (dto.AbcdAnswers.Count(a => a.IsRight) != 1)
                    throw new ValidationException("ABCD otázka musí mať presne jednu správnu odpoveď.");

                dbContext.AbcdQuestionAnswers.RemoveRange(abcdQuestion.AbcdQuestionAnswers);

                abcdQuestion.AbcdQuestionAnswers = dto.AbcdAnswers
                    .Select(a => new AbcdQuestionAnswer
                    {
                        Answer = a.Answer,
                        IsRight = a.IsRight
                    })
                    .ToList();
            }
            else if (question is WritingQuestion writingQuestion)
            {
                if (string.IsNullOrWhiteSpace(dto.Answer))
                    throw new ValidationException("Písomná otázka musí mať odpoveď.");

                writingQuestion.Answer = dto.Answer;
            }
        }

        await dbContext.SaveChangesAsync();

        var updatedQuestion = await dbContext.Questions
            .Include(q => q.Subject)
            .FirstOrDefaultAsync(q => q.Id == id);

        return MapToResponseDto(updatedQuestion!);
    }

    public async Task DeleteQuestionAsync(Guid id)
    {
        var question = await dbContext.Questions.FindAsync(id);
        if (question == null)
            throw new NotFoundException("Otázka neexistuje.");

        dbContext.Questions.Remove(question);
        await dbContext.SaveChangesAsync();
    }

    // ----- TODO ----- //
    /*
    public async Task<List<QuestionResponseDto>> GetRandomQuestions(Guid subjectId, int count = 1)
    {

        var questions = await dbContext.Questions
            .Where(s => s.SubjectId == subjectId)
            .Include(q => q.Subject)
            .Include(q => (q as AbcdQuestion).AbcdQuestionAnswers)
            .OrderBy(_ => Guid.NewGuid());
            

        return questions.Select(MapToResponseDto).ToList();

    }*/

    private QuestionResponseDto MapToResponseDto(Question question)
    {
        var dto = new QuestionResponseDto
        {
            Id = question.Id,
            QuestionText = question.QuestionText,
            SubjectId = question.SubjectId,
            QuestionType = question.QuestionType.ToString(),
            
        };

        if (question is AbcdQuestion abcdQuestion)
        {
            dto.AbcdAnswers = abcdQuestion.AbcdQuestionAnswers
                .Select(a => new AbcdAnswerResponseDto
                {
                    Id = a.Id,
                    Answer = a.Answer,
                    IsRight = a.IsRight
                })
                .ToList();
        }
        else if (question is WritingQuestion writingQuestion)
        {
            dto.Answer = writingQuestion.Answer;
        }

        return dto;
    }
}
