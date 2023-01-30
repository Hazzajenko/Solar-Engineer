using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using MethodTimer;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record GetInitialGroupChatsCombinedQuery
    (AppUser AppUser) : IRequest<IEnumerable<InitialGroupChatCombinedDto>>;

[Time]
public class
    GetInitialGroupChatsCombinedHandler : IRequestHandler<GetInitialGroupChatsCombinedQuery,
        IEnumerable<InitialGroupChatCombinedDto>>
{
    private readonly IDataContext _context;

    public GetInitialGroupChatsCombinedHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<InitialGroupChatCombinedDto>>
        Handle(GetInitialGroupChatsCombinedQuery request, CancellationToken cT)
    {
        var res = _context.AppUserGroupChats
            .Where(x => x.AppUserId == request.AppUser.Id)
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.CreatedBy)
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.GroupChatMessages)
            .ThenInclude(x => x.MessageReadTimes)
            .AsSplitQuery()
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.AppUserGroupChats)
            .ThenInclude(x => x.AppUser)
            .AsSplitQuery()
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.GroupChatServerMessages)
            .AsSplitQuery()
            .Select(x => new InitialGroupChatCombinedDto
            {
                Id = x.GroupChat.Id,
                Name = x.GroupChat.Name,
                PhotoUrl = x.GroupChat.PhotoUrl,
                Permissions = new GroupChatPermissions
                {
                    CanInvite = x.CanInvite,
                    CanKick = x.CanKick
                },
                Members = x.GroupChat.AppUserGroupChats
                    .OrderBy(c => c.JoinedAt)
                    .Select(c => c.ToInitialMemberDto()),
                LatestMessage = x.GroupChat.GroupChatMessages
                    .OrderBy(o => o.MessageSentTime)
                    .Select(y => y.ToDto(request.AppUser))
                    .LastOrDefault(),
                LatestServerMessage = x.GroupChat.GroupChatServerMessages
                    .OrderBy(o => o.MessageSentTime)
                    .Select(c => c.ToDto())
                    .LastOrDefault()
            });
        // .ToListAsync(cT);;

        // res.
        var yo = res.ToQueryString();
        return await res.ToListAsync(cT);

        // Console.WriteLine((res.ToS).ToTraceString());

        return res;
    }
}
/*x.Id,
x.GroupChat.Name,
x.GroupChat.CreatedBy,
x.GroupChat.Created,
x.GroupChat.PhotoUrl,
Messages = x.GroupChat.GroupChatMessages,
Members = x.GroupChat.AppUserGroupChats,
ServerMessages = x.GroupChat.GroupChatServerMessages*/
// public string Name { get; set; } = default!;
// public AppUser CreatedBy { get; set; } = default!;
// public int CreatedById { get; set; }
// public DateTime Created { get; set; }
//
// public string PhotoUrl { get; set; } = default!;
//
// // public string CreatedByUserName { get; set; } = default!;
// public ICollection<AppUserGroupChat> AppUserGroupChats { get; set; } = default!;
// public ICollection<GroupChatMessage> GroupChatMessages { get; set; } = default!;
// public ICollection<GroupChatServerMessage> GroupChatServerMessages { get; set; } = default!;
// return await db.GroupChats
//     .Where(x => request.GroupChatIds.Contains(x.Id))
//     .Include(x => x.AppUserGroupChats)
//     .ThenInclude(x => x.AppUser)
//     .SelectMany(x => x.AppUserGroupChats)
//     .Select(x => x.ToMemberDto())
//     .ToListAsync(cT);