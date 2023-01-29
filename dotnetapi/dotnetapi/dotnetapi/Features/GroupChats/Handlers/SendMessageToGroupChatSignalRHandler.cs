using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Hubs;
using Mediator;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record SendMessageToGroupChatSignalRQuery
    (GroupChatMessageDto Message, string[] UserNames) : IRequest<GroupChatMessageDto>;

public class
    SendMessageToGroupChatSignalRHandler : IRequestHandler<SendMessageToGroupChatSignalRQuery, GroupChatMessageDto>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public SendMessageToGroupChatSignalRHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<GroupChatMessageDto>
        Handle(SendMessageToGroupChatSignalRQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        // var db = scope.ServiceProvider.GetRequiredService<DataContext>();
        var hub = scope.ServiceProvider.GetRequiredService<IHubContext<MessagesHub>>();

        // await db.GroupChatMessages.AddAsync(request.Message, cT);

        //
        // await db.SaveChangesAsync(cT);

        /*
        var groupChatUserNames = await db.GroupChats
            .Where(x => x.Id == request.Message.GroupChatId)
            .Include(x => x.AppUserGroupChats)
            .ThenInclude(x => x.AppUser)
            .SelectMany(x => x.AppUserGroupChats)
            .Select(x => x.AppUser.UserName)
            .ToArrayAsync(cT);
            #1#*/

        await hub.Clients.Users(request.UserNames)
            .SendAsync("GetGroupChatMessages", request.Message, cT);


        return request.Message;
    }
}