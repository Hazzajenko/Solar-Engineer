using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Hubs;
using Mediator;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.GroupChats.Handlers;

public record CreateAppUserGroupChatQuery(AppUserGroupChat AppUserGroupChat) : IRequest<AppUserGroupChat>;

public class
    CreateAppUserGroupChatHandler : IRequestHandler<CreateAppUserGroupChatQuery, AppUserGroupChat>
{
    private readonly IDataContext _context;
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;

    public CreateAppUserGroupChatHandler(IDataContext context, IHubContext<MessagesHub, IMessagesHub> hubContext)
    {
        _context = context;
        _hubContext = hubContext;
    }

    public async ValueTask<AppUserGroupChat>
        Handle(CreateAppUserGroupChatQuery request, CancellationToken cT)
    {
        // foreach (var appUserGroupChat in request.AppUserGroupChats)
        await _context.AppUserGroupChats.AddAsync(request.AppUserGroupChat, cT);

        await _context.SaveChangesAsync(cT);


        return request.AppUserGroupChat;
    }
}