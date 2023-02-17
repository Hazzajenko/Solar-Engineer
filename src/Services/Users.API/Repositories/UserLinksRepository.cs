using DotNetCore.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Users.API.Data;
using Users.API.Entities;
// using Infrastructure.Entities.Identity;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Repositories;

public sealed class UserLinksRepository : EFRepository<UserLink>, IUserLinksRepository
{
    public UserLinksRepository(UsersContext context) : base(context)
    {
    }

    public Task<UserLink?> GetByIdAsync(Guid id)
    {
        return Queryable.SingleOrDefaultAsync(auth => auth.Id == id);
    }

    /*
    public async Task<UserLink> CreateAsync(AppUser appUser, AppUser recipient)
    {
        UserLink userLink = new UserLink(appUser, recipient);
        await AddAsync(userLink);
        return userLink;
    }*/

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