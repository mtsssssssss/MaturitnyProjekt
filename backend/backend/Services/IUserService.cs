using backend.Dto.UserDto;
using backend.Enums;

namespace backend.Services;

public interface IUserService
{
    Task<List<UserListItemDto>> GetUsersAsync();
    Task UpdateUserRoleAsync(Guid userId, UserRole newRole);
    Task UpdateUserPasswordAsync(Guid userId, string newPassword);
}
