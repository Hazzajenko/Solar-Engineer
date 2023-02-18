using Infrastructure.Repositories;
using Users.API.Data;
using Users.API.Entities;

namespace Users.API.Repositories.Users;

public sealed class UsersRepository : GenericRepository<UsersContext, User>, IUsersRepository
{
    public UsersRepository(UsersContext context) : base(context)
    {
    }

}