using Infrastructure.Data;
using Users.API.Repositories.UserLinks;

namespace Users.API.Data;

public interface IUsersUnitOfWork : IUnitOfWorkFactory
{
    // IUsersRepository UsersRepository { get; }
    IUserLinksRepository UserLinksRepository { get; }
}
