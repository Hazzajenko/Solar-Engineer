using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers.InitialGroupChats;

public record GetGroupChatMemberUserNamesQuery(int GroupChatId, AppUser? AppUser = null)
    : IRequest<IEnumerable<string>>;

/*public record GetGroupChatMemberUserNamesResponse
    (IEnumerable<string> UserNames);*/

public class GetGroupChatMemberUserNamesHandler
    : IRequestHandler<GetGroupChatMemberUserNamesQuery, IEnumerable<string>>
{
    private readonly IDataContext _context;

    public GetGroupChatMemberUserNamesHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<string>> Handle(
        GetGroupChatMemberUserNamesQuery request,
        CancellationToken cT
    )
    {
        var groupChatMembers = await _context.AppUserGroupChats
            .Where(x => x.GroupChatId == request.GroupChatId)
            .Include(x => x.AppUser)
            .Select(x => x.AppUser.UserName!)
            .ToArrayAsync(cT);

        if (request.AppUser is not null) return groupChatMembers.Where(x => x != request.AppUser.UserName!).ToArray();

        return groupChatMembers;
    }
}