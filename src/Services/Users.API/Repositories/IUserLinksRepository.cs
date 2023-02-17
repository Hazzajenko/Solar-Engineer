using DotNetCore.Repositories;
using Users.API.Entities;
// using Infrastructure.Entities.Identity;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Repositories;

public interface IUserLinksRepository : IRepository<UserLink>
{
    Task<UserLink?> GetByIdAsync(Guid id);

    // Task<UserLink> CreateAsync(AppUser appUser, AppUser recipient);
    Task<UserLink?> GetByBothUsersAsync(User appUser, User recipient);
}