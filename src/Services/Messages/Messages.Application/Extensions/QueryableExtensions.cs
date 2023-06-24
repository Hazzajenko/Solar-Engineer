using Messages.Domain.Entities;

namespace Messages.Application.Extensions;

public static class QueryableExtensions
{
    public static IQueryable<Message> MarkUnreadAsRead(this IQueryable<Message> query, Guid appUserId)
    {
        var unreadMessages = query.Where(m => m.MessageReadTime == null
                                              && m.RecipientId == appUserId);

        if (unreadMessages.Any())
            foreach (var message in unreadMessages)
                message.MessageReadTime = DateTime.UtcNow;

        return query;
    }
}