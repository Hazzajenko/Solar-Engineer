using Identity.Application.Repositories.AppUserLinks;
using Identity.Application.Repositories.AppUsers;
using Infrastructure.Data;

namespace Identity.Application.Data.UnitOfWork;

public class IdentityUnitOfWork : UnitOfWorkFactory<IdentityContext>, IIdentityUnitOfWork
{
    public IdentityUnitOfWork(IdentityContext context) : base(context)
    {
    }

    public IAppUsersRepository AppUsersRepository => new AppUsersRepository(Context);
    public IAppUserLinksRepository AppUserLinksRepository => new AppUserLinksRepository(Context);
}