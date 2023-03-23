using Infrastructure.Data;

namespace Identity.Application.Data;

public class IdentityUnitOfWork : UnitOfWorkFactory<IdentityContext>, IIdentityUnitOfWork
{
    public IdentityUnitOfWork(IdentityContext context) : base(context)
    {
    }
}