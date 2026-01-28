using backend.Data;
using backend.Dto.SubjectDto;
using backend.Entities;
using backend.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class SubjectsService : ISubjectsService
{
    private readonly AppDbContext dbContext;

    public SubjectsService(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<SubjectResponseDto> CreateSubjectAsync(CreateEditSubjectDto dto)
    {
        var exists = await dbContext.Subjects
        .AnyAsync(s => s.SubjectAbbrev == dto.SubjectAbbrev.ToUpper());

        if (exists)
            throw new ConflictException($"Predmet so skratkou {dto.SubjectAbbrev} uz existuje.");

        var subject = new Subject
        {
            SubjectName = dto.SubjectName,
            SubjectAbbrev = dto.SubjectAbbrev.ToUpper()
        };

        await dbContext.Subjects.AddAsync(subject);
        await dbContext.SaveChangesAsync();

        return MapToResponseDto(subject);
    }

    public async Task<List<SubjectResponseDto>> GetSubjectsListAsync()
    {
        var subjects = await dbContext.Subjects.ToListAsync();

        return subjects.Select(MapToResponseDto).ToList();
    }


    public async Task<SubjectResponseDto> GetSubjectByIdAsync(Guid id)
    {
        var subject = await dbContext.Subjects.FindAsync(id);
        if (subject == null)
            throw new NotFoundException("Predmet neexistuje.");

        return MapToResponseDto(subject);
    }

    public async Task<SubjectResponseDto> UpdateSubjectAsync(Guid id, CreateEditSubjectDto dto)
    {
        var subject = await dbContext.Subjects.FindAsync(id);
        if (subject == null)
            throw new NotFoundException("Predmet neexistuje.");

        var abbrev = dto.SubjectAbbrev.ToUpper()!;

        if (await dbContext.Subjects.AnyAsync(s => s.SubjectAbbrev == abbrev && s.Id != id))
            throw new ConflictException($"Predmet so skratkou {abbrev} už existuje.");

        subject.SubjectName = dto.SubjectName;
        subject.SubjectAbbrev = dto.SubjectAbbrev.ToUpper();        

        await dbContext.SaveChangesAsync();

        return MapToResponseDto(subject);
    }

    public async Task DeleteSubjectAsync(Guid id)
    {
        var subject = await dbContext.Subjects.FindAsync(id);
        if (subject == null)
            throw new NotFoundException("Predmet neexistuje.");

        dbContext.Subjects.Remove(subject);
        await dbContext.SaveChangesAsync();
    }

    private SubjectResponseDto MapToResponseDto(Subject subject)
    {
        var dto = new SubjectResponseDto
        {
            Id = subject.Id,
            SubjectName = subject.SubjectName,
            SubjectAbbrev = subject.SubjectAbbrev,
        };
        
        return dto;
    }
}
