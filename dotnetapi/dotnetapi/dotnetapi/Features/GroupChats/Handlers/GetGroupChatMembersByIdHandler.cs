using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record GetGroupChatMembersByIdQuery
    (int GroupChatId) : IRequest<IEnumerable<GroupChatMemberDto>>;

public class
    GetGroupChatMembersByIdHandler : IRequestHandler<GetGroupChatMembersByIdQuery, IEnumerable<GroupChatMemberDto>>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public GetGroupChatMembersByIdHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<IEnumerable<GroupChatMemberDto>>
        Handle(GetGroupChatMembersByIdQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        return await db.GroupChats
            .Where(x => x.Id == request.GroupChatId)
            .Include(x => x.AppUserGroupChats)
            .ThenInclude(x => x.AppUser)
            .SelectMany(x => x.AppUserGroupChats)
            .Select(x => x.ToMemberDto())
            .ToListAsync(cT);
    }
}