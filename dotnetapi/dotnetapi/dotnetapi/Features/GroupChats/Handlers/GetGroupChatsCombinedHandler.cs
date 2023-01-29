using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using MethodTimer;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record GetGroupChatsCombinedQuery(AppUser AppUser) : IRequest<IEnumerable<GroupChatCombinedDto>>;

[Time]
public class
    GetGroupChatsCombinedHandler : IRequestHandler<GetGroupChatsCombinedQuery, IEnumerable<GroupChatCombinedDto>>
{
    private readonly IDataContext _context;

    public GetGroupChatsCombinedHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<GroupChatCombinedDto>>
        Handle(GetGroupChatsCombinedQuery request, CancellationToken cT)
    {
        var res = await _context.AppUserGroupChats
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
            // .Select(x => x.GroupChatId)
            .Select(x => new GroupChatCombinedDto
            {
                Id = x.GroupChat.Id,
                Name = x.GroupChat.Name,
                PhotoUrl = x.GroupChat.PhotoUrl,
                CreatedById = x.GroupChat.CreatedBy.Id,
                CreatedByUserName = x.GroupChat.CreatedBy.UserName!,
                Created = x.GroupChat.Created,
                Messages = x.GroupChat.GroupChatMessages
                    .OrderBy(o => o.MessageSentTime)
                    .Select(y => y.ToDto(request.AppUser)),
                Members = x.GroupChat.AppUserGroupChats
                    .OrderBy(c => c.JoinedAt)
                    .Select(c => c.ToMemberDto()),
                ServerMessages = x.GroupChat.GroupChatServerMessages
                    .OrderBy(o => o.MessageSentTime)
                    .Select(c => c.ToDto())
            })
            .ToListAsync(cT);

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