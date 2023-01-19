using dotnetapi.Features.Messages.Entities;

namespace dotnetapi.Extensions;

public static class QueryableExtensions
{
    public static IQueryable<Message> MarkUnreadAsRead(this IQueryable<Message> query, string currentUsername)
    {
        var unreadMessages = query.Where(m => m.MessageReadTime == null
                                              && m.RecipientUsername == currentUsername);

        if (unreadMessages.Any())
            foreach (var message in unreadMessages)
                message.MessageReadTime = DateTime.UtcNow;

        return query;
    }
}