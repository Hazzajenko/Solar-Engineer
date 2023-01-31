using dotnetapi.Data;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers.InitialGroupChats;

public record GetGroupChatMemberUserNamesQuery
    (int GroupChatId) : IRequest<GetGroupChatMemberUserNamesResponse>;

public record GetGroupChatMemberUserNamesResponse
    (IEnumerable<string> UserNames);

public class
    GetGroupChatMemberUserNamesHandler : IRequestHandler<GetGroupChatMemberUserNamesQuery,
        GetGroupChatMemberUserNamesResponse>
{
    private readonly IDataContext _context;

    public GetGroupChatMemberUserNamesHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<GetGroupChatMemberUserNamesResponse>
        Handle(GetGroupChatMemberUserNamesQuery request, CancellationToken cT)
    {
        var groupChatMembers = await _context.AppUserGroupChats
            .Where(x => x.GroupChatId == request.GroupChatId)
            .Include(x => x.AppUser)
            .Select(x => x.AppUser.UserName!)
            .ToArrayAsync(cT);

        return new GetGroupChatMemberUserNamesResponse(groupChatMembers);
    }
}