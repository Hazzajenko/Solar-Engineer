using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Contracts.Responses;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public class GetGroupChatsDataQuery : IRequest<ManyGroupChatsDataResponse>
{
    public GetGroupChatsDataQuery(AppUser appUser)
    {
        AppUser = appUser;
    }

    public AppUser AppUser { get; set; }
}

// public sealed record Ping(AppUser AppUser) : IRequest<ManyGroupChatsDataResponse>;

public class GetGroupChatsDataHandler : IRequestHandler<GetGroupChatsDataQuery, ManyGroupChatsDataResponse>
{
    private readonly ILogger<GetGroupChatsDataHandler> _logger;
    private readonly IServiceScopeFactory _scopeFactory;

    public GetGroupChatsDataHandler(IServiceScopeFactory scopeFactory, ILogger<GetGroupChatsDataHandler> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async ValueTask<ManyGroupChatsDataResponse>
        Handle(GetGroupChatsDataQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        var init = await db.AppUserGroupChats
            .Where(x => x.AppUserId == request.AppUser.Id)
            .Include(x => x.GroupChat)
            // .Select(x => x.ToDtoWithoutMembers())
            .ToListAsync(cT);

        var appUserGroupChatIds = init.Select(x => x.GroupChatId).ToList();

        var appUserGroupChats = await db.AppUserGroupChats
            .Where(x => x.AppUserId == request.AppUser.Id)
            .Include(x => x.GroupChat)
            .Select(x => x.ToDtoWithoutMembers())
            .ToListAsync(cT);

        var groupChatMembers = await db.AppUserGroupChats
            .Where(x => appUserGroupChatIds.Contains(x.GroupChatId))
            .Include(x => x.AppUser)
            .Select(x => x.ToMemberDto())
            // .Take(1)
            .ToListAsync(cT);

        // var groupChatMembersResult = new List<GroupChatMemberDto>();
        var groupChatMessagesResult = new List<GroupChatMessageDto>();
        foreach (var appUserGroupChatId in appUserGroupChatIds)
        {
            var groupChatMessage = await db.GroupChatMessages
                .Where(x => x.GroupChatId == appUserGroupChatId)
                .Include(x => x.Sender)
                .Include(x => x.MessageReadTimes)
                .OrderBy(x => x.MessageSentTime)
                .Select(x => x.ToDto())
                .Take(1)
                .SingleOrDefaultAsync(cT);
            if (groupChatMessage is null) continue;
            groupChatMessagesResult.Add(groupChatMessage);
        }

        var result = new ManyGroupChatsDataResponse
        {
            GroupChats = appUserGroupChats,
            GroupChatMembers = groupChatMembers,
            GroupChatMessages = new List<LastGroupChatMessageDto>()
        };

        return result;
        // return new ValueTask<ManyGroupChatsDataResponse>(result);
    }
}