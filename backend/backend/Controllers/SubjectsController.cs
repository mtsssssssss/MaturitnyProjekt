using backend.DTO;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public sealed class SubjectsController : ControllerBase
{
    private readonly SubjectsService _subjectsService;

    public SubjectsController(SubjectsService subjectsService)
    {
        _subjectsService = subjectsService;
    }


    [HttpPost]
    public async Task<ActionResult<SubjectDto>> CreateSubject([FromBody] CreateEditSubjectDto dto)
    {
        var created = await _subjectsService.CreateSubjectAsync(dto);
        return CreatedAtAction(nameof(GetSubjectById), new { id = created.Id }, created);
    }

    [HttpGet]
    public async Task<ActionResult<List<SubjectDto>>> GetSubjectsList()
    {
        var subjects = await _subjectsService.GetSubjectsListAsync();
        return Ok(subjects);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<SubjectDto>> GetSubjectById(Guid id)
    {
        try
        {
            var subject = await _subjectsService.GetSubjectByIdAsync(id);
            return Ok(subject);
        }
        catch (Exception)
        {
            return NotFound();
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<SubjectDto>> EditSubject(Guid id, [FromBody] CreateEditSubjectDto dto)
    {
        try
        {
            var updated = await _subjectsService.EditSubjectAsync(id, dto);
            return Ok(updated);
        }
        catch (Exception)
        {
            return NotFound();
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteSubject(Guid id)
    {
        try
        {
            await _subjectsService.DeleteSubjectAsync(id);
            return NoContent();
        }
        catch (Exception)
        {
            return NotFound();
        }
    }
}
