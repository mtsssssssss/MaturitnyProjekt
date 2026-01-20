using System.Security.Claims;
using backend.Dto.TestDto;
using backend.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using static backend.Services.TestsService;

namespace backend.Controllers;


[Route("api/[controller]")]
[ApiController]
[Authorize]
public class TestsController : ControllerBase
{
    private readonly TestsService testsService;
    public TestsController(TestsService testsService)
    {  
        this.testsService = testsService; 
    }

    [HttpPost("create-random-test")]
    [Authorize()]
    public async Task<ActionResult<CreateRandomTestResponseDto>> CreateRandomTest([FromBody] CreateRandomTestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var result = await testsService.CreateRandomTest(Guid.Parse(userId), dto);

        return Ok(result);           

    }

    /*
    [HttpPost("/create-test")]
    [Authorize]
    public async Task<ActionResult<Test>> CreateTest([FromBody] CreateTestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var result = await testsService.CreateTest(Guid.Parse(userId), dto);

        return Ok(result);

    }*/

    [HttpPost("start-test")]
    public async Task<ActionResult<StartTestResponseDto>> CreateTest([FromBody] StartTestRequestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var result = await testsService.StartTest(Guid.Parse(userId), dto.TestId);

        return Ok(result);

    }

}