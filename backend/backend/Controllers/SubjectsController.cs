using backend.Data;
using backend.DTO;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public sealed class SubjectsController : ControllerBase
{
    private SubjectsService subjectsService;

    public SubjectsController(SubjectsService subjectsService)
    {
        this.subjectsService = subjectsService;
    }


    [HttpPost]
    public ActionResult<Guid> CreateSubject([FromBody] CreateEditSubjectDto dto)
    {
        var subject = subjectsService.CreateSubject(dto);

        return Ok(subject);
    }

    [HttpGet]
    public ActionResult<List<Subject>> GetSubjectsList()
    {
        var subjectsList = subjectsService.GetSubjectsList();

        return Ok(subjectsList);

    }

    [HttpGet("{id}")]
    public ActionResult<Subject> GetSubjectById(Guid id)
    {
        return Ok(subjectsService.GetSubjectById(id));
    }


    [HttpPut("{id}")]
    public ActionResult<Subject> EditSubject(Guid id, [FromBody] CreateEditSubjectDto dto)
    {
        Subject subejct = subjectsService.EditSubject(id, dto);

        return Ok(subejct);
    }

    [HttpDelete("{id}")]
    public ActionResult DeleteSubject(Guid id)
    {
        subjectsService.DeleteSubject(id);
        return Ok();
    }
}
