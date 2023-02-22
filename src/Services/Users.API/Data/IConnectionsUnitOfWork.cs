using Infrastructure.Data;
using Users.API.Repositories.UserConnections;

namespace Users.API.Data;

public interface IConnectionsUnitOfWork : IUnitOfWorkFactory
{
    IUserConnectionsRepository UserConnectionsRepository { get; }
}