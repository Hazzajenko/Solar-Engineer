using Identity.Application.Repositories.AppUserLinks;
using Identity.Application.Repositories.AppUsers;
using Infrastructure.Data;

namespace Identity.Application.Data.UnitOfWork;

public interface IIdentityUnitOfWork : IUnitOfWorkFactory
{
    IAppUsersRepository AppUsersRepository { get; }

    IAppUserLinksRepository AppUserLinksRepository { get; }
}