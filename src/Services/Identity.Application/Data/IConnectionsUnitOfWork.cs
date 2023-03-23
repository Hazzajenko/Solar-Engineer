using Identity.Application.Repositories.UserConnections;
using Infrastructure.Data;

namespace Identity.Application.Data;

public interface IConnectionsUnitOfWork : IUnitOfWorkFactory
{
    IUserConnectionsRepository UserConnectionsRepository { get; }
}