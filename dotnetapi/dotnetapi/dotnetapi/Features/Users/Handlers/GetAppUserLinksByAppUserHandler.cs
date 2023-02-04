using dotnetapi.Data;
using dotnetapi.Extensions;
using dotnetapi.Features.Users.Data;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers;

public record GetAppUserLinksByAppUserQuery(AppUser AppUser)
    : IRequest<IEnumerable<AppUserLinkDto>>;

public class GetAppUserLinksByAppUserHandler
    : IRequestHandler<GetAppUserLinksByAppUserQuery, IEnumerable<AppUserLinkDto>>
{
    private readonly IDataContext _context;

    public GetAppUserLinksByAppUserHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<AppUserLinkDto>> Handle(
        GetAppUserLinksByAppUserQuery request,
        CancellationToken cT
    )
    {
        return await _context.AppUserLinks
            .Where(
                m =>
                    m.AppUserRequestedUserName == request.AppUser.UserName
                    || m.AppUserReceivedUserName == request.AppUser.UserName
            )
            .Include(x => x.AppUserReceived)
            .Include(x => x.AppUserRequested)
            .ProjectToDtoListAsync();
        // .Select(x => x.ToDto())
        // .ToListAsync(cT);
    }
}