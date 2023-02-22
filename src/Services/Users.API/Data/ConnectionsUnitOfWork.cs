using Infrastructure.Data;
using Users.API.Repositories.UserConnections;

namespace Users.API.Data;

public class ConnectionsUnitOfWork : UnitOfWorkFactory<ConnectionsContext>, IConnectionsUnitOfWork
{
    public ConnectionsUnitOfWork(ConnectionsContext context) : base(context)
    {
    }

    public IUserConnectionsRepository UserConnectionsRepository => new UserConnectionsRepository(Context);
}