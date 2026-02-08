using backend.Data;
using backend.Dto.UserDto;
using backend.Enums;
using backend.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public sealed class UserService : IUserService
{
    private readonly AppDbContext dbContext;

    public UserService(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }

    public async Task<List<UserListItemDto>> GetUsersAsync()
    {
        var users = await dbContext.Users
            .OrderBy(u => u.CreatedAt)
            .ToListAsync();

        return users.Select(u => new UserListItemDto
        {
            Id = u.Id,
            Username = u.Username,
            FirstName = u.FirstName,
            LastName = u.LastName,
            Role = u.Role.ToString(),
            CreatedAt = u.CreatedAt
        }).ToList();
    }

    public async Task UpdateUserRoleAsync(Guid userId, UserRole newRole)
    {
        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
            throw new NotFoundException("Používateľ neexistuje.");

        user.Role = newRole;
        await dbContext.SaveChangesAsync();
    }

    public async Task UpdateUserPasswordAsync(Guid userId, string newPassword)
    {
        if (string.IsNullOrWhiteSpace(newPassword))
            throw new ValidationException("Heslo nesmie byť prázdne.");

        var user = await dbContext.Users.FirstOrDefaultAsync(u => u.Id == userId);

        if (user is null)
            throw new NotFoundException("Používateľ neexistuje.");

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await dbContext.SaveChangesAsync();
    }
}
