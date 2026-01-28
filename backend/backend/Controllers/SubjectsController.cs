using backend.Dto.SubjectDto;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public sealed class SubjectsController : ControllerBase
{
    private readonly ISubjectsService subjectsService;

    public SubjectsController(ISubjectsService subjectsService)
    {
        this.subjectsService = subjectsService;
    }


    [HttpPost]
    public async Task<ActionResult<SubjectResponseDto>> CreateSubject([FromBody] CreateEditSubjectDto dto)
    {
        var created = await subjectsService.CreateSubjectAsync(dto);
        return CreatedAtAction(nameof(GetSubjectById), new { id = created.Id }, created);
    }

    [HttpGet]
    public async Task<ActionResult<List<SubjectResponseDto>>> GetSubjectsList()
    {
        var subjects = await subjectsService.GetSubjectsListAsync();
        return Ok(subjects);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SubjectResponseDto>> GetSubjectById(Guid id)
    {
        var subject = await subjectsService.GetSubjectByIdAsync(id);
        return Ok(subject);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SubjectResponseDto>> UpdateSubject(Guid id, [FromBody] CreateEditSubjectDto dto)
    {
        var updated = await subjectsService.UpdateSubjectAsync(id, dto);
        return Ok(updated);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteSubject(Guid id)
    {
        await subjectsService.DeleteSubjectAsync(id);
        return NoContent();
    }
}
