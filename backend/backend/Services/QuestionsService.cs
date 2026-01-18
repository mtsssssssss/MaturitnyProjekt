using backend.Data;
using backend.DTO;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public sealed class QuestionsService
{
    private readonly AppDbContext dbContext;

    public QuestionsService(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    // Vytvorenie otázky a vrátenie DTO
    public async Task<QuestionResponseDto> CreateQuestionAsync(CreateEditQuestionDto dto)
    {
        if (!await dbContext.Subjects.AnyAsync(s => s.Id == dto.SubjectId))
            throw new Exception("Predmet neexistuje.");

        Question question;

        if (dto.QuestionType == QuestionType.Abcd)
        {
            if (dto.AbcdAnswers == null || dto.AbcdAnswers.Count < 2)
            {
                throw new Exception("ABCD otázka musí mať minimálne 2 odpovede.");
            }

            if (dto.AbcdAnswers.Count(a => a.IsRight) != 1)
            {
                throw new Exception("ABCD otázka musí mať presne jednu správnu odpoveď.");
            }

            question = new AbcdQuestion
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
        }
        else if (dto.QuestionType == QuestionType.Writing)
        {
            if (string.IsNullOrWhiteSpace(dto.Answer))
            {
                throw new Exception("Písomná otázka musí mať odpoveď.");
            }

            question = new WritingQuestion
            {
                QuestionText = dto.QuestionText,
                SubjectId = dto.SubjectId,
                Answer = dto.Answer
            };
        }
        else
        {
            throw new Exception("Neplatný typ otázky.");
        }

        await dbContext.Questions.AddAsync(question);
        await dbContext.SaveChangesAsync();

        return MapToResponseDto(question);
    }

    // Získanie všetkých otázok
    public async Task<List<QuestionResponseDto>> GetQuestionsListAsync()
    {
        var questions = await dbContext.Questions
            .Include(q => q.Subject)
            .ToListAsync();

        return questions.Select(MapToResponseDto).ToList();
    }

    // Získanie otázky podľa ID
    public async Task<QuestionResponseDto> GetQuestionByIdAsync(Guid id)
    {
        var question = await dbContext.Questions
            .Include(q => q.Subject)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null)
            throw new Exception("Otázka neexistuje.");

        return MapToResponseDto(question);
    }

    // Editácia otázky
    public async Task<QuestionResponseDto> EditQuestionAsync(Guid id, CreateEditQuestionDto dto)
    {
        var question = await dbContext.Questions
            .Include(q => q is AbcdQuestion ? ((AbcdQuestion)q).AbcdQuestionAnswers : null)
            .FirstOrDefaultAsync(q => q.Id == id);

        if (question == null)
            throw new Exception("Otázka neexistuje.");

        if (!await dbContext.Subjects.AnyAsync(s => s.Id == dto.SubjectId))
            throw new Exception("Predmet neexistuje.");

        // Ak sa zmenil typ otázky, musíme vytvoriť novú
        if (question is AbcdQuestion && dto.QuestionType == QuestionType.Writing)
        {
            // Odstrániť starú otázku
            dbContext.Questions.Remove(question);
            await dbContext.SaveChangesAsync();

            // Vytvoriť novú písomnú otázku
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
            // Odstrániť starú otázku
            dbContext.Questions.Remove(question);
            await dbContext.SaveChangesAsync();

            // Vytvoriť novú ABCD otázku
            if (dto.AbcdAnswers == null || dto.AbcdAnswers.Count < 2)
            {
                throw new Exception("ABCD otázka musí mať minimálne 2 odpovede.");
            }

            if (dto.AbcdAnswers.Count(a => a.IsRight) != 1)
            {
                throw new Exception("ABCD otázka musí mať presne jednu správnu odpoveď.");
            }

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
            // Aktualizovať existujúcu otázku
            question.QuestionText = dto.QuestionText;
            question.SubjectId = dto.SubjectId;

            if (question is AbcdQuestion abcdQuestion)
            {
                if (dto.AbcdAnswers == null || dto.AbcdAnswers.Count < 2)
                {
                    throw new Exception("ABCD otázka musí mať minimálne 2 odpovede.");
                }

                if (dto.AbcdAnswers.Count(a => a.IsRight) != 1)
                {
                    throw new Exception("ABCD otázka musí mať presne jednu správnu odpoveď.");
                }

                // Odstrániť staré odpovede
                dbContext.AbcdQuestionAnswers.RemoveRange(abcdQuestion.AbcdQuestionAnswers);

                // Pridať nové odpovede
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
                {
                    throw new Exception("Písomná otázka musí mať odpoveď.");
                }

                writingQuestion.Answer = dto.Answer;
            }
        }

        await dbContext.SaveChangesAsync();

        // Načítať aktualizovanú otázku s načítanými navigačnými vlastnosťami
        var updatedQuestion = await dbContext.Questions
            .Include(q => q.Subject)
            .FirstOrDefaultAsync(q => q.Id == id);

        return MapToResponseDto(updatedQuestion!);
    }

    // Odstránenie otázky
    public async Task<bool> DeleteQuestionAsync(Guid id)
    {
        var question = await dbContext.Questions.FindAsync(id);
        if (question == null)
            throw new Exception("Otázka neexistuje.");

        dbContext.Questions.Remove(question);
        await dbContext.SaveChangesAsync();

        return true;
    }

    // Pomocná metóda na mapovanie Question na QuestionResponseDto
    private QuestionResponseDto MapToResponseDto(Question question)
    {
        var dto = new QuestionResponseDto
        {
            Id = question.Id,
            QuestionText = question.QuestionText,
            SubjectId = question.SubjectId,
            QuestionType = question is AbcdQuestion ? QuestionType.Abcd : QuestionType.Writing
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
