using Infrastructure.Repositories;
using Messages.API.Contracts.Data;
using Messages.API.Data;
using Messages.API.Entities;
using Messages.API.Mapping;
using Microsoft.EntityFrameworkCore;

// using AppUser = Users.API.Entities.AppUser;

namespace Messages.API.Repositories.UserGroupChats;

public sealed class UserGroupChatsRepository : GenericRepository<MessagesContext, UserGroupChat>,
    IUserGroupChatsRepository
{
    public UserGroupChatsRepository(MessagesContext context) : base(context)
    {
    }

    public async Task<IEnumerable<string>> GetGroupChatMemberIdsAsync(Guid groupChatId, Guid? userId = null)
    {
        return await Queryable
            .Where(x => x.GroupChatId == groupChatId)
            // .Include(x => x.User)
            .Select(x => x.AppUserId.ToString())
            .Where(x => userId == null || x != userId.ToString())
            .ToArrayAsync();
        // return new List<string>();
    }

    public async Task<IEnumerable<GroupChatDto>> GetLatestGroupChatMessagesAsync(Guid appUserId)
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId)
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.CreatedBy)
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.GroupChatMessages)
            .ThenInclude(x => x.MessageReadTimes)
            .AsSplitQuery()
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.UserGroupChats)
            // .ThenInclude(x => x.AppUser)
            .AsSplitQuery()
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.GroupChatServerMessages)
            .AsSplitQuery()
            .Select(x => new GroupChatDto
            {
                Id = x.GroupChat.Id.ToString(),
                Name = x.GroupChat.Name,
                PhotoUrl = x.GroupChat.PhotoUrl,
                Members = x.GroupChat.UserGroupChats
                    .OrderBy(c => c.JoinedAt)
                    .Select(c => c.ToInitialMemberDto()),
                LatestMessage = x.GroupChat.GroupChatMessages
                    .OrderBy(o => o.MessageSentTime)
                    .Select(y => y.ToCombinedDto(appUserId))
                    .LastOrDefault()
                /*LatestServerMessage = x.GroupChat.GroupChatServerMessages
                    .OrderBy(o => o.MessageSentTime)
                    .Select(c => c.ToDto())
                    .LastOrDefault()*/
            }).ToListAsync();
    }
}