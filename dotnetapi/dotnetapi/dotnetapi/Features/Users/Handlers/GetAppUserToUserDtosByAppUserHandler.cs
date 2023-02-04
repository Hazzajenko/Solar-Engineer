using dotnetapi.Data;
using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers;

public record GetAppUserToUserDtosByAppUserQuery(AppUser AppUser)
    : IRequest<IEnumerable<AppUserToUserDto>>;

public class GetAppUserToUserDtosByAppUserHandler
    : IRequestHandler<GetAppUserToUserDtosByAppUserQuery, IEnumerable<AppUserToUserDto>>
{
    private readonly IDataContext _context;

    public GetAppUserToUserDtosByAppUserHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<AppUserToUserDto>> Handle(
        GetAppUserToUserDtosByAppUserQuery request,
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
            .Select(x => x.ToUserToUserDto(request.AppUser))
            .ToListAsync(cT);
    }
}