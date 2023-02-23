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

    public async Task<IEnumerable<MessageDto>> GetUserMessagesWithUser(User appUser, User recipientUser)
    {
        return await Queryable
            .Where(m => (m.Recipient.Id == appUser.Id && m.RecipientDeleted == false
                                                      && m.Sender.Id ==
                                                      recipientUser.Id)
                        || (m.Recipient.Id == recipientUser.Id
                            && m.Sender.Id == appUser.Id && m.SenderDeleted == false)
            )
            .Include(x => x.Sender)
            .Include(x => x.Recipient)
            .MarkUnreadAsRead(appUser)
            .OrderBy(x => x.MessageSentTime)
            .Select(x => x.ToDto(appUser))
            .ToListAsync();
    }
    
    
    public async Task<IEnumerable<LatestUserMessageDto>> GetLatestUserMessagesAsync(Guid appUserId)
    {
        return await Queryable
            .Where(x => x.SenderId == appUserId ||
                        x.RecipientId == appUserId)
            .Include(x => x.Sender)
            .Include(x => x.Recipient)
            // .OrderBy(x => x.MessageSentTime)
            .GroupBy(x => x.Sender.UserName == request.AppUser.UserName ? x.Recipient.UserName : x.Sender.UserName)

            // .OrderBy(x => x.Select(x => x.MessageSentTime))
            .Select(x => new LatestUserMessageDto
            {
                UserName = x.Key!,
                Message = x.OrderByDescending(o => o.MessageSentTime)
                    .Select(y => y.ToDto(request.AppUser))
                    .SingleOrDefault()
            })
            .ToListAsync(cT);
    }
}