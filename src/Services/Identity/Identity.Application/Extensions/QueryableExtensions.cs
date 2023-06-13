using Identity.Domain;

namespace Identity.Application.Extensions;

public static class QueryableExtensions
{
    /*public static IQueryable<Notification> MarkUnreadAsRead(this IQueryable<Notification> query, string currentUsername)
    {
        var unreadMessages = query.Where(m => m.MessageReadTime == null
                                              && m.RecipientUserName == currentUsername);

        if (unreadMessages.Any())
            foreach (var message in unreadMessages)
                message.MessageReadTime = DateTime.UtcNow;

        return query;
    }*/
}