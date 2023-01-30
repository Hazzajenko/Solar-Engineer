using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using MethodTimer;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers.InitialGroupChats;

public class InitialGroupChatDto
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
}

public sealed record GetInitialGroupChatsQuery
    (AppUser AppUser) : IRequest<IEnumerable<InitialGroupChatCombinedDto>>;

[Time]
public class
    GetInitialGroupChatsHandler : IRequestHandler<GetInitialGroupChatsQuery,
        IEnumerable<InitialGroupChatCombinedDto>>
{
    private readonly IDataContext _context;

    public GetInitialGroupChatsHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<InitialGroupChatCombinedDto>>
        Handle(GetInitialGroupChatsQuery request, CancellationToken cT)
    {
        var initialGroupChat = _context.AppUserGroupChats
            .Where(x => x.AppUserId == request.AppUser.Id)
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.CreatedBy)
            .Select(x => new InitialGroupChatDto
            {
                Id = x.GroupChat.Id,
                Name = x.GroupChat.Name,
                PhotoUrl = x.GroupChat.PhotoUrl
            });

        var members = _context.GroupChats
            .Include(x => x.AppUserGroupChats)
            .ThenInclude(x => x.AppUser)
            .Select(x => x.AppUserGroupChats
                .OrderBy(c => c.JoinedAt)
                .Select(c => c.ToInitialMemberDto()));

        var initialMessage = _context.GroupChats
            .Include(x => x.GroupChatMessages)
            .ThenInclude(x => x.MessageReadTimes)
            .Select(x => x.GroupChatMessages
                .OrderBy(o => o.MessageSentTime)
                .Select(y => y.ToDto(request.AppUser))
                .LastOrDefault());

        var initialServerMessage = _context.GroupChats
            .Include(x => x.GroupChatServerMessages)
            .Select(x => x.GroupChatServerMessages
                .OrderBy(o => o.MessageSentTime)
                .Select(c => c.ToDto())
                .LastOrDefault());

        return new List<InitialGroupChatCombinedDto>();
        // var res1 = initialGroupChat.GroupJoin(members.ToList(), x => x.Id, y => y.)
        // .ToListAsync(cT);;
// initialGroupChat.J
        // res.
        // var yo = res.ToQueryString();
        // return await res.ToListAsync(cT);
    }
}
/*.Include(x => x.GroupChat)
    .ThenInclude(x => x.GroupChatMessages)
    .ThenInclude(x => x.MessageReadTimes)*/
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

/*LatestMessage = y.GroupChat.GroupChatMessages
                        .Select(c =>
                        {
                            var lastMessage = y.GroupChat.GroupChatMessages.MaxBy(o => o.MessageSentTime);
                            var lastServerMessage = y.GroupChat.GroupChatServerMessages.MaxBy(o => o.MessageSentTime);
                            if (lastMessage is null && lastServerMessage is not null)
                            {
                                return new GroupChatMessageDto
                                {
                                    Id = 0,
                                    GroupChatId = 0,
                                    SenderUserName = "SERVER",
                                    Content = lastServerMessage.Content,
                                    MessageReadTimes = new List<GroupChatReadTimeDto>(),
                                    MessageSentTime = lastServerMessage.MessageSentTime,
                                    IsUserSender = false,
                                };
                            }
                            if (lastServerMessage is null && lastMessage is not null)
                            {
                                return lastMessage.ToDto(request.AppUser);
                            }

                            if (lastServerMessage is null && lastMessage is null)
                            {
                                return new { };
                            }
                            var compare = lastMessage!.MessageSentTime.CompareTo(lastServerMessage);
                            if (compare>0)
                            {
                                return lastMessage.ToDto(request.AppUser);
                            }

                            return new GroupChatMessageDto
                            {
                                Id = 0,
                                GroupChatId = 0,
                                SenderUserName = "SERVER",
                                Content = lastServerMessage!.Content,
                                MessageReadTimes = new List<GroupChatReadTimeDto>(),
                                MessageSentTime = lastServerMessage.MessageSentTime,
                                IsUserSender = false,
                            };
                        })*/
/*.Select(c => c.MessageSentTime.CompareTo(y.GroupChat.GroupChatServerMessages
    .OrderBy(o => o.MessageSentTime).LastOrDefault()))*/
/*.Select(c => c.MessageSentTime > y.GroupChat.GroupChatServerMessages
    .OrderBy(o => o.MessageSentTime).LastOrDefault())*/
// .LastOrDefault(),