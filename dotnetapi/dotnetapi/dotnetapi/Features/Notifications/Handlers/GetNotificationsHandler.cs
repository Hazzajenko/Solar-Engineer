using dotnetapi.Data;
using dotnetapi.Features.Notifications.Data;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Notifications.Handlers;

public record GetNotificationsQuery(AppUser AppUser) : IRequest<IEnumerable<NotificationDto>>;

public class GetNotificationsHandler
    : IRequestHandler<GetNotificationsQuery, IEnumerable<NotificationDto>>
{
    private readonly IDataContext _context;

    public GetNotificationsHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<NotificationDto>> Handle(
        GetNotificationsQuery request,
        CancellationToken cT
    )
    {
        return await _context.Notifications
            .Where(m => m.AppUserUserName == request.AppUser.UserName)
            .Include(x => x.NotificationFrom)
            .ProjectToDtoListAsync();
    }
}