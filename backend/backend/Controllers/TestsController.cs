using backend.Data;
using backend.DTO;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;


[Route("api/[controller]")]
[ApiController]
public class TestsController : ControllerBase
{
    private readonly TestsService testsService;
    public TestsController(TestsService testsService)
    {  
        this.testsService = testsService; 
    }

    [HttpPost]
    public ActionResult CreateTest([FromBody] CreateTestDto dto)
    {

        var result = testsService.CreateTest(dto);
        // po vytvoreni testu by sme mali vratit testId

        return Ok(
            new
            {
                Id = "nigga123"
            });

    }

}