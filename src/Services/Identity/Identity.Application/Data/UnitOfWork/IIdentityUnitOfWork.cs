using Identity.Application.Repositories.AppUserLinks;
using Identity.Application.Repositories.AppUsers;
using Identity.Application.Repositories.Notifications;
using Infrastructure.Data;

namespace Identity.Application.Data.UnitOfWork;

public interface IIdentityUnitOfWork : IUnitOfWorkFactory
{
    IAppUsersRepository AppUsersRepository { get; }

    IAppUserLinksRepository AppUserLinksRepository { get; }

    INotificationsRepository NotificationsRepository { get; }
}
