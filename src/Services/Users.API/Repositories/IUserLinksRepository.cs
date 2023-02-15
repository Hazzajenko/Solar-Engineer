using DotNetCore.Repositories;
using Infrastructure.Entities.Identity;
using Users.API.Entities;
// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Repositories;

public interface IUserLinksRepository : IRepository<UserLink>
{
    Task<UserLink?> GetByIdAsync(Guid id);

    // Task<UserLink> CreateAsync(AppUser appUser, AppUser recipient);
    Task<UserLink?> GetByBothUsersAsync(AppUser appUser, AppUser recipient);
}