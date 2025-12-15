using backend.Data;
using backend.DTO;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public sealed class QuestionsController : ControllerBase
{
    private QuestionsService questionService;

    public QuestionsController(QuestionsService questionService)
    {
        this.questionService = questionService;
    }


    [HttpPost]
    public ActionResult<Question> CreateQuestion([FromBody] CreateQuestionDto dto)
    {

        var question = questionService.CreateQuestion(dto);

        return Ok(question);
    }
 
    
}
