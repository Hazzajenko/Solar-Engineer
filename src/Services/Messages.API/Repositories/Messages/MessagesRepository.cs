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
}