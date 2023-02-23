using Infrastructure.Repositories;
using Messages.API.Contracts.Data;
using Messages.API.Data;
using Messages.API.Entities;
using Messages.API.Extensions;
using Messages.API.Mapping;
using Microsoft.EntityFrameworkCore;

// using AppUser = Users.API.Entities.AppUser;

namespace Messages.API.Repositories.Messages;

public sealed class MessagesRepository : GenericRepository<MessagesContext, Message>, IMessagesRepository
{
    public MessagesRepository(MessagesContext context) : base(context)
    {
    }

    public async Task<IEnumerable<MessageDto>> GetUserMessagesWithUserAsync(Guid appUserId, Guid recipientUserId)
    {
        return await Queryable
            .Where(m => (m.RecipientId == appUserId && m.RecipientDeleted == false
                                                    && m.SenderId ==
                                                    recipientUserId)
                        || (m.RecipientId == recipientUserId
                            && m.SenderId == appUserId && m.SenderDeleted == false)
            )
            .MarkUnreadAsRead(appUserId)
            .OrderBy(x => x.MessageSentTime)
            .Select(x => x.ToDto(appUserId))
            .ToListAsync();
    }


    public async Task<IEnumerable<LatestUserMessageDto>> GetLatestUserMessagesAsync(Guid appUserId)
    {
        return await Queryable
            .Where(x => x.SenderId == appUserId ||
                        x.RecipientId == appUserId)
            .GroupBy(x => x.SenderId == appUserId ? x.RecipientId : x.SenderId)
            .OrderBy(x => x.Select(message => message.MessageSentTime))
            .Select(x => new LatestUserMessageDto
            {
                UserId = x.Key.ToString(),
                Message = x.OrderByDescending(o => o.MessageSentTime)
                    .Select(y => y.ToDto(appUserId))
                    .SingleOrDefault()
            })
            .ToListAsync();
    }
}