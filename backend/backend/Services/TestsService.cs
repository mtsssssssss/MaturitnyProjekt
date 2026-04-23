using backend.Data;
using backend.Dto.TestDto;
using backend.Entities;
using backend.Enums;
using backend.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class TestsService : ITestsService
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
            SubjectId = dto.SubjectId,
            TestName = subject.SubjectAbbrev + " Test",
            TestDescription = "Prípravný test z predmetu " + subject.SubjectName,
            TimeLimitMinutes = dto.Time,
            CreatedByUserId = userId,
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

    public async Task<CreateManualTestResponseDto> CreateManualTestAsync(Guid creatorUserId, CreateManualTestDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.TestName))
            throw new ValidationException("Názov testu je povinný.");

        if (dto.TimeLimitMinutes <= 0)
            throw new ValidationException("Časový limit musí byť väčší ako 0.");

        if (dto.QuestionIds.Count == 0)
            throw new ValidationException("Vyberte aspoň jednu otázku.");

        var subjectExists = await dbContext.Subjects.AnyAsync(s => s.Id == dto.SubjectId);
        if (!subjectExists)
            throw new NotFoundException("Predmet neexistuje.");

        var questions = await dbContext.Questions
            .Where(q => dto.QuestionIds.Contains(q.Id))
            .Select(q => new { q.Id, q.SubjectId })
            .ToListAsync();

        if (questions.Count != dto.QuestionIds.Count)
            throw new ValidationException("Niektoré vybrané otázky neexistujú.");

        if (questions.Any(q => q.SubjectId != dto.SubjectId))
            throw new ValidationException("Všetky otázky musia byť z rovnakého predmetu.");

        var usersToAssign = dto.AssignedUserIds.Distinct().ToList();
        if (usersToAssign.Count == 0)
            throw new ValidationException("Vyberte aspoň jedného používateľa, ktorému sa test pridelí.");

        var existingUsersCount = await dbContext.Users.CountAsync(u => usersToAssign.Contains(u.Id));
        if (existingUsersCount != usersToAssign.Count)
            throw new ValidationException("Niektorí vybraní používatelia neexistujú.");

        var test = new Test
        {
            Id = Guid.NewGuid(),
            TestName = dto.TestName,
            TestDescription = dto.TestDescription,
            TimeLimitMinutes = dto.TimeLimitMinutes,
            SubjectId = dto.SubjectId,
            CreatedByUserId = creatorUserId,
            TestQuestions = dto.QuestionIds.Select(qid => new TestQuestion
            {
                QuestionId = qid
            }).ToList()
        };

        dbContext.Tests.Add(test);

        var assignments = usersToAssign.Select(uid => new TestAssignment
        {
            Id = Guid.NewGuid(),
            Test = test,
            UserId = uid,
            AssignedByUserId = creatorUserId,
            AssignedAt = DateTime.UtcNow
        }).ToList();

        dbContext.TestAssignments.AddRange(assignments);
        await dbContext.SaveChangesAsync();

        return new CreateManualTestResponseDto { Id = test.Id };
    }

    public async Task<List<AssignedTestListItemDto>> GetAssignedTestsAsync(Guid userId)
    {
        var assigned = await dbContext.TestAssignments
            .Include(a => a.Test).ThenInclude(t => t.Subject)
            .Where(a => a.UserId == userId)
            .OrderByDescending(a => a.AssignedAt)
            .Select(a => new AssignedTestListItemDto
            {
                TestId = a.TestId,
                TestName = a.Test.TestName,
                TestDescription = a.Test.TestDescription,
                SubjectName = a.Test.Subject.SubjectName,
                TimeLimitMinutes = a.Test.TimeLimitMinutes,
                AssignedAt = a.AssignedAt
            })
            .ToListAsync();

        return assigned;
    }

    public async Task<List<AttemptResultListItemDto>> GetMyAttemptsAsync(Guid userId)
    {
        var attempts = await dbContext.TestAttempts
            .Include(a => a.Test).ThenInclude(t => t.Subject)
            .Where(a => a.UserId == userId && a.TestStatus == TestStatus.Finished)
            .OrderByDescending(a => a.TestFinished)
            .Select(a => new AttemptResultListItemDto
            {
                TestAttemptId = a.Id,
                TestId = a.TestId,
                TestName = a.Test.TestName,
                SubjectName = a.Test.Subject.SubjectName,
                TestStarted = a.TestStarted,
                TestFinished = a.TestFinished,
                TotalQuestions = a.TotalQuestions,
                CorrectAnswers = a.CorrectAnswers,
                TotalScorePercentage = a.TotalScorePercentage
            })
            .ToListAsync();

        return attempts;
    }

    // public async Task<List<StudentAttemptResultListItemDto>> GetStudentAttemptsAsync(Guid teacherUserId)
    public async Task<List<StudentAttemptResultListItemDto>> GetStudentAttemptsAsync()
    {
        //.Where(a => a.TestStatus == TestStatus.Finished && a.Test.CreatedByUserId == teacherUserId) // DOKONCIT AK BUDE CAS

        var attempts = await dbContext.TestAttempts
            .Include(a => a.Test).ThenInclude(t => t.Subject)
            .Include(a => a.User)
            .Where(a => a.TestStatus == TestStatus.Finished) // PREROBENY RIADOK
            .OrderByDescending(a => a.TestFinished)
            .Select(a => new StudentAttemptResultListItemDto
            {
                TestAttemptId = a.Id,
                TestId = a.TestId,
                TestName = a.Test.TestName,
                SubjectName = a.Test.Subject.SubjectName,
                TestStarted = a.TestStarted,
                TestFinished = a.TestFinished,
                TotalQuestions = a.TotalQuestions,
                CorrectAnswers = a.CorrectAnswers,
                TotalScorePercentage = a.TotalScorePercentage,
                UserId = a.UserId,
                Username = a.User.Username,
                FirstName = a.User.FirstName,
                LastName = a.User.LastName
            })
            .ToListAsync();

        return attempts;
    }


    public async Task<StartTestResponseDto> StartTest(Guid userId, Guid testId)
    {
        var test = await dbContext.Tests
            .Include(t => t.TestQuestions)
                .ThenInclude(tq => tq.Question)
            .FirstOrDefaultAsync(t => t.Id == testId);

        if (test == null)
            throw new NotFoundException("Test neexistuje.");

        var lastAttempt = await dbContext.TestAttempts
            .Where(ta => ta.TestId == testId && ta.UserId == userId)
            .OrderByDescending(ta => ta.TestStarted)
            .FirstOrDefaultAsync();

        TestAttempt testAttempt;

        if (lastAttempt is null || lastAttempt.TestStatus == TestStatus.Finished)
        {
            testAttempt = new TestAttempt
            {
                Id = Guid.NewGuid(),
                TestId = testId,
                UserId = userId,
                AttemptName = test.TestName + " - " + DateTime.UtcNow.ToString("yyyy-MM-dd HH:mm"),
                TestStarted = DateTime.UtcNow,
                TestStatus = TestStatus.InProgress,
                TotalQuestions = test.TestQuestions.Count
            };

            dbContext.TestAttempts.Add(testAttempt);
            await dbContext.SaveChangesAsync();
        }

        else if (lastAttempt.TestStatus == TestStatus.InProgress)
        {
            testAttempt = lastAttempt;
        }

        else
        {
            lastAttempt.TestStatus = TestStatus.InProgress;
            lastAttempt.TestStarted ??= DateTime.UtcNow;
            testAttempt = lastAttempt;
            await dbContext.SaveChangesAsync();
        }

        var testQuestions = await dbContext.TestQuestions
            .Where(tq => tq.TestId == testId)
            .Include(tq => tq.Question)
            .ToListAsync();

        var abcdQuestionIds = testQuestions
            .Where(tq => tq.Question is AbcdQuestion)
            .Select(tq => tq.QuestionId)
            .ToList();

        var abcdAnswers = await dbContext.AbcdQuestionAnswers
            .Where(a => abcdQuestionIds.Contains(a.AbcdQuestionId))
            .ToListAsync();

        var questionDtos = testQuestions.Select(tq =>
        {
            var q = tq.Question;
            var dto = new QuestionResponseDto
            {
                Id = q.Id,
                QuestionText = q.QuestionText,
                Type = q.QuestionType,
            };

            if (q is AbcdQuestion)
            {
                dto.Answers = abcdAnswers
                    .Where(a => a.AbcdQuestionId == q.Id)
                    .Select(a => new AbcdAnswerResponseDto
                    {
                        Id = a.Id,
                        Answer = a.Answer
                    })
                    .ToList();
            }

            return dto;
        }).ToList();

        return new StartTestResponseDto
        {
            Id = test.Id,
            TestAttemptId = testAttempt.Id,
            TestName = test.TestName,
            TestDescription = test.TestDescription,
            TimeLimitMinutes = test.TimeLimitMinutes,
            Questions = questionDtos
        };
    }

    public async Task<bool> SubmitAnswer(Guid userId, SubmitAnswerDto dto)
    {
        var testAttempt = await dbContext.TestAttempts
            .Include(ta => ta.UserAnswers)
            .FirstOrDefaultAsync(ta => ta.Id == dto.TestAttemptId);

        if (testAttempt == null)
            throw new NotFoundException("Pokus o test neexistuje.");

        if (testAttempt.UserId != userId)
            throw new UnauthorizedException("Nemáte oprávnenie na tento pokus o test.");

        if (testAttempt.TestStatus != TestStatus.InProgress)
            throw new ValidationException("Test už nie je aktívny.");

        var question = await dbContext.Questions
            .Include(q => (q as AbcdQuestion).AbcdQuestionAnswers)
            .FirstOrDefaultAsync(q => q.Id == dto.QuestionId);

        if (question == null)
            throw new NotFoundException("Otázka neexistuje.");

        var test = await dbContext.Tests
            .Include(t => t.TestQuestions)
            .FirstOrDefaultAsync(t => t.Id == testAttempt.TestId);

        if (test == null || !test.TestQuestions.Any(tq => tq.QuestionId == dto.QuestionId))
            throw new ValidationException("Otázka nepatrí do tohto testu.");

        bool isCorrect = false;
        string userAnswerString = string.Empty;

        if (question is AbcdQuestion abcdQuestion)
        {
            if (!dto.SelectedAbcdAnswerId.HasValue)
                throw new ValidationException("Pre ABCD otázku musíte vybrať odpoveď.");

            var selectedAnswer = abcdQuestion.AbcdQuestionAnswers
                .FirstOrDefault(a => a.Id == dto.SelectedAbcdAnswerId.Value);

            if (selectedAnswer == null)
                throw new NotFoundException("Vybraná odpoveď neexistuje.");

            isCorrect = selectedAnswer.IsRight;
            userAnswerString = selectedAnswer.Answer;
        }
        else if (question is WritingQuestion writingQuestion)
        {
            if (string.IsNullOrWhiteSpace(dto.WrittenAnswer))
                throw new ValidationException("Pre písomnú otázku musíte zadať odpoveď.");

            userAnswerString = dto.WrittenAnswer;
            
            string normalizedCorrectAnswer = NormalizeAnswer(writingQuestion.Answer);
            string normalizedUserAnswer = NormalizeAnswer(dto.WrittenAnswer);
            
            isCorrect = string.Equals(normalizedCorrectAnswer, normalizedUserAnswer, StringComparison.OrdinalIgnoreCase);
        }

        var existingAnswer = await dbContext.TestAttemptUserAnswers
            .FirstOrDefaultAsync(ua => ua.TestAttemptId == dto.TestAttemptId && ua.QuestionId == dto.QuestionId);

        if (existingAnswer != null)
        {
            existingAnswer.UserAnswer = userAnswerString;
            existingAnswer.IsCorrect = isCorrect;
        }
        else
        {
            var userAnswer = new TestAttemptUserAnswer
            {
                Id = Guid.NewGuid(),
                TestAttemptId = dto.TestAttemptId,
                QuestionId = dto.QuestionId,
                UserAnswer = userAnswerString,
                IsCorrect = isCorrect
            };

            dbContext.TestAttemptUserAnswers.Add(userAnswer);
        }

        await dbContext.SaveChangesAsync();

        return isCorrect;
    }

    public async Task<FinishTestResponseDto> FinishTest(Guid userId, FinishTestDto dto)
    {
        var testAttempt = await dbContext.TestAttempts
            .Include(ta => ta.UserAnswers)
            .FirstOrDefaultAsync(ta => ta.Id == dto.TestAttemptId);

        if (testAttempt == null)
            throw new NotFoundException("Pokus o test neexistuje.");

        if (testAttempt.UserId != userId)
            throw new UnauthorizedException("Nemáte oprávnenie na tento pokus o test.");

        if (testAttempt.TestStatus != TestStatus.InProgress)
            throw new ValidationException("Test už nie je aktívny.");

        var correctAnswersCount = testAttempt.UserAnswers.Count(ua => ua.IsCorrect);
        var totalQuestions = testAttempt.TotalQuestions;
        var scorePercentage = totalQuestions > 0 
            ? (decimal)correctAnswersCount / totalQuestions * 100 
            : 0;

        testAttempt.TestStatus = TestStatus.Finished;
        testAttempt.TestFinished = DateTime.UtcNow;
        testAttempt.CorrectAnswers = correctAnswersCount;
        testAttempt.TotalScorePercentage = scorePercentage;

        await dbContext.SaveChangesAsync();

        return new FinishTestResponseDto
        {
            TestAttemptId = testAttempt.Id,
            TotalQuestions = totalQuestions,
            CorrectAnswers = correctAnswersCount,
            TotalScorePercentage = scorePercentage,
            TestFinished = testAttempt.TestFinished.Value
        };
    }

    private string NormalizeAnswer(string answer)
    {
        if (string.IsNullOrWhiteSpace(answer))
            return string.Empty;

        return answer
            .Trim()
            .ToLowerInvariant()
            .Replace(" ", string.Empty);
    }

}
