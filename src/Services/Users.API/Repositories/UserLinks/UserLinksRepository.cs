using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Users.API.Data;
using Users.API.Entities;

// using Infrastructure.Entities.Identity;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Repositories.UserLinks;

public sealed class UserLinksRepository : GenericRepository<UsersContext, UserLink>, IUserLinksRepository
{
    public UserLinksRepository(UsersContext context) : base(context)
    {
    }

    public Task<UserLink?> GetByBothUsersAsync(User appUser, User recipient)
    {
        return Queryable
            .Where(m => (m.AppUserRequestedId == appUser.Id
                         && m.AppUserReceivedId ==
                         recipient.Id)
                        || (m.AppUserRequestedId == recipient.Id
                            && m.AppUserReceivedId == appUser.Id)
            )
            .SingleOrDefaultAsync();
    }
}