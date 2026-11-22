using backend.Data;
using backend.Entities;
using FluentValidation;

public record CreateSubjectCommand(string SubjectName, string SubjectAbbrev)
{
    public string SubjectName { get; } = SubjectName.Trim();
    public string SubjectAbbrev { get; } = SubjectAbbrev.Trim().ToUpper();
}


public class CreateSubjectCommandValidator : AbstractValidator<CreateSubjectCommand>
{
    public CreateSubjectCommandValidator()
    {
        RuleFor(x => x.SubjectName)
            .NotEmpty().WithMessage("Subject name is required.")
            .MaximumLength(100).WithMessage("Subject name cannot exceed 100 characters.");

        RuleFor(x => x.SubjectAbbrev)
            .NotEmpty().WithMessage("Subject abbreviation is required.")
            .Length(3).WithMessage("Subject abbreviation must be exactly 3 characters.")
            .Matches("^[A-Z]{3}$").WithMessage("Subject abbreviation must be uppercase letters.");
    }
}

public class CreateSubjectCommandHandler(AppDbContext dbContext)
{
    public async Task Handle(CreateSubjectCommand request, CancellationToken cancellationToken)
    {
        var subject = new Subject
        {
            SubjectName = request.SubjectName.Trim(),
            SubjectAbbrev = request.SubjectAbbrev.Trim().ToUpper()
        };

        dbContext.Subjects.Add(subject);
        await dbContext.SaveChangesAsync(cancellationToken);

    }
}