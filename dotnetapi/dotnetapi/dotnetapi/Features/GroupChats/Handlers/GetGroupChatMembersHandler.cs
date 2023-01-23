using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

/*
public class GetGroupChatsDataQuery : IRequest<ManyGroupChatsDataResponse>
{
    public GetGroupChatsDataQuery(AppUser appUser)
    {
        AppUser = appUser;
    }

    public AppUser AppUser { get; set; }
}
*/

// public sealed record Ping(AppUser AppUser) : IRequest<ManyGroupChatsDataResponse>;
public sealed record GetGroupChatMembersQuery(AppUser AppUser, IEnumerable<int> GroupChatIds) : IRequest<IEnumerable<GroupChatMemberDto>>;

public class GetGroupChatMembersHandler : IRequestHandler<GetGroupChatMembersQuery, IEnumerable<GroupChatMemberDto>>
{
    private readonly ILogger<GetGroupChatMembersHandler> _logger;
    private readonly IServiceScopeFactory _scopeFactory;

    public GetGroupChatMembersHandler(IServiceScopeFactory scopeFactory, ILogger<GetGroupChatMembersHandler> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async ValueTask<IEnumerable<GroupChatMemberDto>>
        Handle(GetGroupChatMembersQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        return await db.AppUserGroupChats
            .Where(x => request.GroupChatIds.Contains(x.GroupChatId))
            .Include(x => x.AppUser)
            .Select(x => x.ToMemberDto())
            .ToListAsync(cT);
    }
}