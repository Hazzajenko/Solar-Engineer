using Infrastructure.Data;
using Users.API.Repositories;
using Users.API.Repositories.UserLinks;
using Users.API.Repositories.Users;

namespace Users.API.Data;

public interface IUsersUnitOfWork : IUnitOfWorkFactory
{
    IUsersRepository UsersRepository { get; }
    IUserLinksRepository UserLinksRepository { get; }
}