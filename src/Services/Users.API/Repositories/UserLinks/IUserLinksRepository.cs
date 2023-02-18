using Infrastructure.Repositories;
using Users.API.Entities;

// using Infrastructure.Entities.Identity;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Repositories.UserLinks;

public interface IUserLinksRepository : IGenericRepository<UserLink>
{

    Task<UserLink?> GetByBothUsersAsync(User appUser, User recipient);
}