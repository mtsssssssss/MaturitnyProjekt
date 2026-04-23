using System.Security.Claims;
using backend.Dto.TestDto;
using backend.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;


[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TestsController : ControllerBase
{
    private readonly ITestsService testsService;

    public TestsController(ITestsService testsService)
    {
        this.testsService = testsService;
    }

    [HttpPost("create-random-test")]
    public async Task<ActionResult<CreateRandomTestResponseDto>> CreateRandomTest([FromBody] CreateRandomTestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var result = await testsService.CreateRandomTest(Guid.Parse(userId), dto);

        return Ok(result);           

    }
    /*
    [HttpPost("create-test")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<CreateRandomTestResponseDto>> CreateTest([FromBody] CreateRandomTestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var result = await testsService.CreateRandomTest(Guid.Parse(userId), dto);

        return Ok(result);

    }
    */

    [HttpPost("create-manual-test")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<CreateManualTestResponseDto>> CreateManualTest([FromBody] CreateManualTestDto dto)
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await testsService.CreateManualTestAsync(userId, dto);
        return Ok(result);
    }


    [HttpPost("test-start")]
    public async Task<ActionResult<StartTestResponseDto>> StartTest([FromBody] StartTestRequestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var result = await testsService.StartTest(Guid.Parse(userId), dto.TestId);

        return Ok(result);
    }

    [HttpGet("assigned")]
    public async Task<ActionResult<List<AssignedTestListItemDto>>> GetAssignedTests()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await testsService.GetAssignedTestsAsync(userId);
        return Ok(result);
    }

    [HttpGet("my-attempts")]
    public async Task<ActionResult<List<AttemptResultListItemDto>>> GetMyAttempts()
    {
        var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        var result = await testsService.GetMyAttemptsAsync(userId);
        return Ok(result);
    }

    [HttpGet("student-attempts")]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<List<StudentAttemptResultListItemDto>>> GetStudentAttempts()
    {
        // var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);
        // var result = await testsService.GetStudentAttemptsAsync(userId);
        var result = await testsService.GetStudentAttemptsAsync();
        return Ok(result);
    }

    [HttpPost("submit-answer")]
    public async Task<ActionResult<bool>> SubmitAnswer([FromBody] SubmitAnswerDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var result = await testsService.SubmitAnswer(Guid.Parse(userId), dto);

        return Ok(result);
    }

    [HttpPost("finish-test")]
    public async Task<ActionResult<FinishTestResponseDto>> FinishTest([FromBody] FinishTestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var result = await testsService.FinishTest(Guid.Parse(userId), dto);

        return Ok(result);
    }

}