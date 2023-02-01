using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Hubs;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record CreateManyAppUserGroupChatsQuery(int GroupChatId, IEnumerable<AppUserGroupChat> AppUserGroupChats,
    IEnumerable<string>? UserNames = null) : IRequest<IEnumerable<AppUserGroupChat>>;

public class
    CreateManyAppUserGroupChatsHandler : IRequestHandler<CreateManyAppUserGroupChatsQuery,
        IEnumerable<AppUserGroupChat>>
{
    private readonly IDataContext _context;
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;

    public CreateManyAppUserGroupChatsHandler(IDataContext context, IHubContext<MessagesHub, IMessagesHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async ValueTask<IEnumerable<AppUserGroupChat>>
        Handle(CreateManyAppUserGroupChatsQuery request, CancellationToken cT)
    {
        foreach (var appUserGroupChat in request.AppUserGroupChats)
            await _context.AppUserGroupChats.AddAsync(appUserGroupChat, cT);

        await _context.SaveChangesAsync(cT);

        var userNames = request.UserNames ?? await _context.AppUserGroupChats
            .Where(x => x.GroupChatId == request.GroupChatId)
            .Include(x => x.AppUser)
            .Select(x => x.AppUser.UserName!)
            .ToArrayAsync(cT);

        var newMembers = request.AppUserGroupChats.Select(x => x.ToInitialMemberDto());

        await _hubContext.Clients.Users(userNames)
            .AddGroupChatMembers(newMembers, cT);


        return request.AppUserGroupChats;
    }
}