using backend.Dto.QuestionDto;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public sealed class QuestionsController : ControllerBase
{
    private readonly IQuestionsService questionsService;

    public QuestionsController(IQuestionsService questionsService)
    {
        this.questionsService = questionsService;
    }

    [HttpPost("bulk-insert")]
    public async Task<IActionResult> CreateQuestionsBulkAsync(IEnumerable<CreateEditQuestionDto> dto)
    {
        var created = await questionsService.CreateQuestionsBulkAsync(dto);
        return Ok();
    }


    [HttpPost]
    public async Task<ActionResult<QuestionResponseDto>> CreateQuestion([FromBody] CreateEditQuestionDto dto)
    {
        var created = await questionsService.CreateQuestionAsync(dto);
        return CreatedAtAction(nameof(GetQuestionById), new { id = created.Id }, created);
    }

    [HttpGet]
    public async Task<ActionResult<List<QuestionResponseDto>>> GetQuestionsList()
    {
        var questions = await questionsService.GetQuestionsListAsync();
        return Ok(questions);
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<QuestionResponseDto>> GetQuestionById(Guid id)
    {
        var question = await questionsService.GetQuestionByIdAsync(id);
        return Ok(question);
    }

    [HttpPut("{id:guid}")]
    public async Task<ActionResult<QuestionResponseDto>> EditQuestion(Guid id, [FromBody] CreateEditQuestionDto dto)
    {
        var updated = await questionsService.EditQuestionAsync(id, dto);
        return Ok(updated);
    }

    [HttpDelete("{id:guid}")]
    public async Task<ActionResult> DeleteQuestion(Guid id)
    {
        await questionsService.DeleteQuestionAsync(id);
        return NoContent();
    }
}
