using Infrastructure.Repositories;
using Messages.Application.Data;
using Messages.Application.Mapping;
using Messages.Contracts.Data;
using Messages.Domain.Entities;
using Microsoft.EntityFrameworkCore;

// using AppUser = Users.API.Entities.AppUser;

namespace Messages.Application.Repositories.AppUserGroupChats;

public sealed class AppUserGroupChatsRepository
    : EntityToEntityRepository<MessagesContext, AppUserGroupChat>,
        IAppUserGroupChatsRepository
{
    public AppUserGroupChatsRepository(MessagesContext context)
        : base(context) { }

    public async Task<IEnumerable<string>> GetGroupChatMemberIdsAsync(
        Guid groupChatId,
        Guid? userId = null
    )
    {
        return await Queryable
            .Where(x => x.GroupChatId == groupChatId)
            .Select(x => x.AppUserId.ToString())
            .Where(x => userId == null || x != userId.ToString())
            .ToArrayAsync();
    }

    public async Task<IEnumerable<MessagePreviewDto>> GetLatestGroupChatMessagesAsPreviewAsync(
        Guid appUserId
    )
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId)
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.GroupChatMessages)
            .ThenInclude(x => x.MessageReadTimes)
            .AsSplitQuery()
            .Include(x => x.GroupChat)
            // .ThenInclude(x => x.AppUserGroupChats)
            // .AsSplitQuery()
            .Select(x => x.ToMessagePreviewDto(appUserId))
            .ToListAsync();
    }

    public async Task<IEnumerable<GroupChatDto>> GetLatestGroupChatMessagesAsync(Guid appUserId)
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId)
            .Include(x => x.GroupChat)
            // .ThenInclude(x => x.CreatedBy)
            // .Include(x => x.GroupChat)
            .ThenInclude(x => x.GroupChatMessages)
            .ThenInclude(x => x.MessageReadTimes)
            .AsSplitQuery()
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.AppUserGroupChats)
            .AsSplitQuery()
            .Select(
                x =>
                    new GroupChatDto
                    {
                        Id = x.GroupChat.Id.ToString(),
                        Name = x.GroupChat.Name,
                        PhotoUrl = x.GroupChat.PhotoUrl,
                        Members = x.GroupChat.AppUserGroupChats
                            .OrderBy(c => c.CreatedTime)
                            .Select(c => c.ToInitialMemberDto()),
                        LatestMessage = x.GroupChat.GroupChatMessages
                            .OrderBy(o => o.MessageSentTime)
                            .Select(y => y.ToCombinedDto(appUserId))
                            .LastOrDefault()
                    }
            )
            .ToListAsync();
    }

    public async Task<AppUserGroupChat?> GetByAppUserAndGroupChatIdAsync(
        Guid appUserId,
        Guid groupChatId
    )
    {
        return await Queryable.SingleOrDefaultAsync(
            x => x.AppUserId == appUserId && x.GroupChatId == groupChatId
        );
    }
}
