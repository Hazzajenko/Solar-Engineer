using Infrastructure.Repositories;
using Messages.API.Data;
using Messages.API.Entities;

// using AppUser = Users.API.Entities.AppUser;

namespace Messages.API.Repositories.Users;

public sealed class UsersRepository : GenericRepository<MessagesContext, User>, IUsersRepository
{
    public UsersRepository(MessagesContext context) : base(context)
    {
    }
}