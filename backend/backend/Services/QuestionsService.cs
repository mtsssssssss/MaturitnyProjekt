using System.ComponentModel.DataAnnotations;
using backend.Data;
using backend.Dto.QuestionDto;
using backend.Dto.SubjectDto;
using backend.Entities;
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

        var subject = await dbContext.Subjects.FindAsync(dto.SubjectId);
        if (subject == null)
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
                Subject = subject,
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
                Subject = subject,
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
        .Include(q => q.Subject) // Toto je na Question, pôjde to pre všetko
        .Include(q => (q as AbcdQuestion).AbcdQuestionAnswers) // Podmienený include
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
            .Include(q => q.Subject)
            .Include(q => (q as AbcdQuestion).AbcdQuestionAnswers)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null)
            throw new NotFoundException("Otázka neexistuje.");

        var subject = await dbContext.Subjects.FindAsync(dto.SubjectId);
        if (subject == null)
            throw new NotFoundException("Predmet neexistuje.");

        question.QuestionText = dto.QuestionText;
        question.SubjectId = Guid.Parse(dto.SubjectId);
        question.Subject = subject; 

        if (question is AbcdQuestion abcdQuestion)
        {
            ValidateAbcdAnswers(dto.AbcdAnswers);

            dbContext.AbcdQuestionAnswers.RemoveRange(abcdQuestion.AbcdQuestionAnswers);
            abcdQuestion.AbcdQuestionAnswers = dto.AbcdAnswers
                .Select(a => new AbcdQuestionAnswer
                {
                    Answer = a.Answer,
                    IsRight = a.IsRight
                }).ToList();
        }
        else if (question is WritingQuestion writingQuestion)
        {
            if (string.IsNullOrWhiteSpace(dto.Answer))
                throw new ValidationException("Písomná otázka musí mať odpoveď.");

            writingQuestion.Answer = dto.Answer;
        }

        await dbContext.SaveChangesAsync();

        return MapToResponseDto(question);
    }

    private void ValidateAbcdAnswers(List<CreateEditAbcdAnswerDto>? answers)
    {
        if (answers == null || answers.Count < 2)
            throw new ValidationException("ABCD otázka musí mať minimálne 2 odpovede.");

        if (answers.Count(a => a.IsRight) != 1)
            throw new ValidationException("ABCD otázka musí mať presne jednu správnu odpoveď.");
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
            Subject = new SubjectResponseDto
            {
                Id = question.Subject.Id,
                SubjectAbbrev = question.Subject.SubjectAbbrev,
                SubjectName = question.Subject.SubjectName,
            },
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
