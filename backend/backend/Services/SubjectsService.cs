using backend.Data;
using backend.DTO;
using backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class SubjectsService
{
    private readonly AppDbContext _dbContext;

    public SubjectsService(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    // Vytvorenie predmetu a vrátenie DTO
    public async Task<SubjectDto> CreateSubjectAsync(CreateEditSubjectDto dto)
    {
        var subject = new Subject
        {
            SubjectName = dto.SubjectName,
            SubjectAbbrev = dto.SubjectAbbrev.ToUpper()
        };

        await _dbContext.Subjects.AddAsync(subject);
        await _dbContext.SaveChangesAsync();

        return new SubjectDto
        {
            Id = subject.Id,
            SubjectName = subject.SubjectName,
            SubjectAbbrev = subject.SubjectAbbrev
        };
    }

    // Získanie všetkých predmetov
    public async Task<List<SubjectDto>> GetSubjectsListAsync()
    {
        return await _dbContext.Subjects
            .Select(s => new SubjectDto
            {
                Id = s.Id,
                SubjectName = s.SubjectName,
                SubjectAbbrev = s.SubjectAbbrev
            })
            .ToListAsync();
    }

    // Získanie predmetu podľa ID
    public async Task<SubjectDto> GetSubjectByIdAsync(Guid id)
    {
        var subject = await _dbContext.Subjects.FindAsync(id);
        if (subject == null)
            throw new Exception("Predmet neexistuje.");

        return new SubjectDto
        {
            Id = subject.Id,
            SubjectName = subject.SubjectName,
            SubjectAbbrev = subject.SubjectAbbrev
        };
    }

    // Editácia predmetu
    public async Task<SubjectDto> EditSubjectAsync(Guid id, CreateEditSubjectDto dto)
    {
        var subject = await _dbContext.Subjects.FindAsync(id);
        if (subject == null)
            throw new Exception("Predmet neexistuje.");

        subject.SubjectName = dto.SubjectName;
        subject.SubjectAbbrev = dto.SubjectAbbrev.ToUpper();

        await _dbContext.SaveChangesAsync();

        return new SubjectDto
        {
            Id = subject.Id,
            SubjectName = subject.SubjectName,
            SubjectAbbrev = subject.SubjectAbbrev
        };
    }

    // Odstránenie predmetu
    public async Task<bool> DeleteSubjectAsync(Guid id)
    {
        var subject = await _dbContext.Subjects.FindAsync(id);
        if (subject == null)
            throw new Exception("Predmet neexistuje.");

        _dbContext.Subjects.Remove(subject);
        await _dbContext.SaveChangesAsync();

        return true;
    }
}
