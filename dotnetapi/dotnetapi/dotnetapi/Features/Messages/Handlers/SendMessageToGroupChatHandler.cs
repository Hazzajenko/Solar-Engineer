using dotnetapi.Data;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Hubs;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Messages.Handlers;

public sealed record SendMessageToGroupChatQuery(GroupChatMessage Message) : IRequest<GroupChatMessageDto>;

public class
    SendMessageToGroupChatHandler : IRequestHandler<SendMessageToGroupChatQuery, GroupChatMessageDto>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public SendMessageToGroupChatHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<GroupChatMessageDto>
        Handle(SendMessageToGroupChatQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();
        var hub = scope.ServiceProvider.GetRequiredService<IHubContext<MessagesHub>>();

        await db.GroupChatMessages.AddAsync(request.Message, cT);
        await db.SaveChangesAsync(cT);

        var groupChatUsernames = await db.GroupChats
            .Where(x => x.Id == request.Message.GroupChatId)
            .Include(x => x.AppUserGroupChats)
            .ThenInclude(x => x.AppUser)
            .SelectMany(x => x.AppUserGroupChats)
            .Select(x => x.AppUser.UserName)
            .ToArrayAsync(cT);

        // var groupChatUsers = chatMemberDtos.Select(x => x.Username).ToArray();
        // var groupChatUsernames = await _groupChatsRepository.GetGroupChatMembersAsync()

        /*_logger.LogInformation("{User} Sent a Message To Group {Recipient}", appUser.UserName!,
            appUserGroupChat.GroupChat.Name!);*/

        await hub.Clients.Users(groupChatUsernames!)
            .SendAsync("GetGroupChatMessages", request.Message.ToDto(), cT);


        return request.Message.ToDto();
    }
}