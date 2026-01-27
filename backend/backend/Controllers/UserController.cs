using backend.Dto.UserDto;
using backend.Entities;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public sealed class UserController : ControllerBase
{
    private readonly UserService userService;

    public UserController(UserService userService)
    {
        this.userService = userService;
    }

    [HttpGet]
    public async Task<ActionResult<List<UserListItemDto>>> GetUsers()
    {
        var users = await userService.GetUsersAsync();
        return Ok(users);
    }

    [HttpPut("{id:guid}/role")]
    public async Task<IActionResult> UpdateUserRole(Guid id, [FromBody] UpdateUserRoleDto dto)
    {
        await userService.UpdateUserRoleAsync(id, dto.Role);
        return NoContent();
    }

    [HttpPut("{id:guid}/password")]
    public async Task<IActionResult> UpdateUserPassword(Guid id, [FromBody] UpdateUserPasswordDto dto)
    {
        await userService.UpdateUserPasswordAsync(id, dto.NewPassword);
        return NoContent();
    }
}
