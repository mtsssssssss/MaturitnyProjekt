using System.Security.Claims;
using backend.Data;
using backend.DTO;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

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

    [HttpPost("/create")]
    [Authorize]
    public ActionResult CreateTest([FromBody] CreateTestDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier)!;

        var result = testsService.CreateTest(Guid.Parse(userId), dto);

        return Ok(
            new
            {
                Id = "nigga123"
            });

    }

}