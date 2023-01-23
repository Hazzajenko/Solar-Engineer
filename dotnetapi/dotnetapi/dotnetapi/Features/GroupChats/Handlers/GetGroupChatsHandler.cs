using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

/*
public class GetGroupChatsQuery : IRequest<ManyGroupChatsDataResponse>
{
    public GetGroupChatsDataQuery(AppUser appUser)
    {
        AppUser = appUser;
    }

    public AppUser AppUser { get; set; }
}
*/

public sealed record GetGroupChatsQuery(AppUser AppUser) : IRequest<IEnumerable<GroupChatWithoutMembersDto>>;

public class GetGroupChatsHandler : IRequestHandler<GetGroupChatsQuery, IEnumerable<GroupChatWithoutMembersDto>>
{
    private readonly ILogger<GetGroupChatsHandler> _logger;
    private readonly IServiceScopeFactory _scopeFactory;

    public GetGroupChatsHandler(IServiceScopeFactory scopeFactory, ILogger<GetGroupChatsHandler> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async ValueTask<IEnumerable<GroupChatWithoutMembersDto>>
        Handle(GetGroupChatsQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        return await db.AppUserGroupChats
            .Where(x => x.AppUserId == request.AppUser.Id)
            .Include(x => x.GroupChat)
            .Select(x => x.ToDtoWithoutMembers())
            .ToListAsync(cT);
    }
}