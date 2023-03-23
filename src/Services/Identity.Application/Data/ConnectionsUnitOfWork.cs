using Identity.Application.Repositories.UserConnections;
using Infrastructure.Data;

namespace Identity.Application.Data;

public class ConnectionsUnitOfWork : UnitOfWorkFactory<ConnectionsContext>, IConnectionsUnitOfWork
{
    public ConnectionsUnitOfWork(ConnectionsContext context) : base(context)
    {
    }

    public IUserConnectionsRepository UserConnectionsRepository => new UserConnectionsRepository(Context);
}