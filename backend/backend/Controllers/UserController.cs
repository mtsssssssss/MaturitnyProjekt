using backend.Dto.UserDto;
using backend.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public sealed class UserController : ControllerBase
{
    private readonly IUserService userService;

    public UserController(IUserService userService)
    {
        this.userService = userService;
    }

    [HttpGet]
    [Authorize(Roles = "Teacher,Admin")]
    public async Task<ActionResult<List<UserListItemDto>>> GetUsers()
    {
        var users = await userService.GetUsersAsync();
        return Ok(users);
    }

    [HttpPut("{id:guid}/role")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUserRole(Guid id, [FromBody] UpdateUserRoleDto dto)
    {
        await userService.UpdateUserRoleAsync(id, dto.Role);
        return NoContent();
    }

    [HttpPut("{id:guid}/password")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUserPassword(Guid id, [FromBody] UpdateUserPasswordDto dto)
    {
        await userService.UpdateUserPasswordAsync(id, dto.NewPassword);
        return NoContent();
    }
}
