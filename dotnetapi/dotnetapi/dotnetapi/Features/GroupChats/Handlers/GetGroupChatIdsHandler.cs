using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record GetGroupChatIdsQuery(AppUser AppUser) : IRequest<IEnumerable<int>>;

public class GetGroupChatIdsHandler : IRequestHandler<GetGroupChatIdsQuery, IEnumerable<int>>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public GetGroupChatIdsHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<IEnumerable<int>>
        Handle(GetGroupChatIdsQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        return await db.AppUserGroupChats
            .Where(x => x.AppUserId == request.AppUser.Id)
            .Include(x => x.GroupChat)
            .Select(x => x.GroupChatId)
            .ToListAsync(cT);
    }
}