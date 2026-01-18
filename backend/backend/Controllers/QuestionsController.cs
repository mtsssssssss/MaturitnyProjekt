using backend.DTO;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public sealed class QuestionsController : ControllerBase
{
    private readonly QuestionsService questionsService;

    public QuestionsController(QuestionsService questionsService)
    {
        this.questionsService = questionsService;
    }

    [HttpPost]
    public async Task<ActionResult<QuestionResponseDto>> CreateQuestion([FromBody] CreateEditQuestionDto dto)
    {
        try
        {
            var created = await questionsService.CreateQuestionAsync(dto);
            return CreatedAtAction(nameof(GetQuestionById), new { id = created.Id }, created);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpGet]
    public async Task<ActionResult<List<QuestionResponseDto>>> GetQuestionsList()
    {
        var questions = await questionsService.GetQuestionsListAsync();
        return Ok(questions);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<QuestionResponseDto>> GetQuestionById(Guid id)
    {
        try
        {
            var question = await questionsService.GetQuestionByIdAsync(id);
            return Ok(question);
        }
        catch (Exception)
        {
            return NotFound();
        }
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<QuestionResponseDto>> EditQuestion(Guid id, [FromBody] CreateEditQuestionDto dto)
    {
        try
        {
            var updated = await questionsService.EditQuestionAsync(id, dto);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            return BadRequest(new { error = ex.Message });
        }
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteQuestion(Guid id)
    {
        try
        {
            await questionsService.DeleteQuestionAsync(id);
            return NoContent();
        }
        catch (Exception)
        {
            return NotFound();
        }
    }
}
