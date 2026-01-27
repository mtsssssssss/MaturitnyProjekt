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

    public async Task<List<QuestionResponseDto>> CreateQuestionsBulkAsync(IEnumerable<CreateEditQuestionDto> dtos)
    {
        if (dtos == null || !dtos.Any())
            throw new ValidationException("Zoznam otázok nesmie byť prázdny.");

        // Optimalizácia: Vytiahneme si ID všetkých predmetov, ktoré sú v DTOs
        var subjectIds = dtos.Select(d => d.SubjectId).Distinct().ToList();
        var subjects = await dbContext.Subjects
            .Where(s => subjectIds.Contains(s.Id))
            .ToDictionaryAsync(s => s.Id);

        var questionsToAdd = new List<Question>();

        foreach (var dto in dtos)
        {
            // Kontrola, či predmet existuje v našom vytiahnutom slovníku
            if (!subjects.TryGetValue(dto.SubjectId, out var subject))
                throw new NotFoundException($"Predmet s ID {dto.SubjectId} neexistuje.");

            Question question;

            if (dto.QuestionType == QuestionType.Abcd)
            {
                if (dto.AbcdAnswers == null || dto.AbcdAnswers.Count < 2)
                    throw new ValidationException($"Otázka '{dto.QuestionText}' musí mať minimálne 2 odpovede.");

                if (dto.AbcdAnswers.Count(a => a.IsRight) != 1)
                    throw new ValidationException($"Otázka '{dto.QuestionText}' musí mať presne jednu správnu odpoveď.");

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
                    throw new ValidationException($"Písomná otázka '{dto.QuestionText}' musí mať odpoveď.");

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

            questionsToAdd.Add(question);
        }

        // Hromadné pridanie do kontextu
        await dbContext.Questions.AddRangeAsync(questionsToAdd);
        await dbContext.SaveChangesAsync();

        // Mapovanie výsledkov späť na DTOs
        return questionsToAdd.Select(q => MapToResponseDto(q)).ToList();
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
            .Include(q => q.Subject)
            .Include(q => (q as AbcdQuestion).AbcdQuestionAnswers)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null)
            throw new NotFoundException("Otázka neexistuje.");

        var subject = await dbContext.Subjects.FindAsync(dto.SubjectId);
        if (subject == null)
            throw new NotFoundException("Predmet neexistuje.");

        question.QuestionText = dto.QuestionText;
        question.SubjectId = dto.SubjectId;
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
