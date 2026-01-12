using backend.Data;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class UserService
{
    private readonly DbContext dbContext;

    public UserService(AppDbContext dbContext)
    {
        this.dbContext = dbContext;
    }



}
