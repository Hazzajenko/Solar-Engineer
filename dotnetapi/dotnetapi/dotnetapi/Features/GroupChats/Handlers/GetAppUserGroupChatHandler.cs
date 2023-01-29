using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record GetAppUserGroupChatQuery(AppUser AppUser, int GroupChatId) : IRequest<AppUserGroupChat?>;

public class GetAppUserGroupChatHandler : IRequestHandler<GetAppUserGroupChatQuery, AppUserGroupChat?>
{
    private readonly IDataContext _context;

    public GetAppUserGroupChatHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<AppUserGroupChat?>
        Handle(GetAppUserGroupChatQuery request, CancellationToken cT)
    {
        return await _context.AppUserGroupChats
            .Where(x => x.AppUser.Id == request.AppUser.Id && x.GroupChatId == request.GroupChatId)
            .Include(x => x.GroupChat)
            .SingleOrDefaultAsync(cT);
    }
}