using Infrastructure.Repositories;
using Users.API.Entities;

// using AppUser = Users.API.Entities.AppUser;

namespace Users.API.Repositories.Users;

public interface IUsersRepository : IGenericRepository<User>
{

}