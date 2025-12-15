using backend.Data;
using backend.DTO;
using Microsoft.AspNetCore.Mvc;

namespace backend.Services;

public class SubjectsService
{
    private readonly AppDbContext dbContext;

    public SubjectsService(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public Guid CreateSubject(CreateEditSubjectDto dto)
    {
        Subject subject = new Subject
        {
            SubjectName = dto.SubjectName,
            SubjectAbbrev = dto.SubjectAbbrev.ToUpper(),
        };

        dbContext.Subjects.Add(subject);
        dbContext.SaveChanges();

        return subject.Id;
    }

    public List<Subject> GetSubjectsList()
    {
        return dbContext.Subjects.ToList();
    }

    public Subject GetSubjectById(Guid id)
    {
        Subject? subject = dbContext.Subjects.Find(id);

        if (subject == null)
        {
            throw new Exception();
        }

        return subject;
    }

    public Subject EditSubject(Guid id, CreateEditSubjectDto dto)
    {
        Subject? subject = dbContext.Subjects.Find(id);

        if (subject == null)
        {
            throw new Exception();
        }

        subject.SubjectName = dto.SubjectName;
        subject.SubjectAbbrev = dto.SubjectAbbrev.ToUpper();

        dbContext.SaveChanges();
        return subject;
    }

    public void DeleteSubject(Guid id)
    {
        var subject = dbContext.Subjects.Find(id);
        
        if (subject == null)
        {
            throw new Exception();
        }

        dbContext.Subjects.Remove(subject);
        dbContext.SaveChanges();
    }

}
