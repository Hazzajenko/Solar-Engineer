using dotnetapi.Data;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

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

    public static IQueryable<GroupChatMessage> MarkUnreadAsReadFromUser(this IQueryable<GroupChatMessage> query,
        DataContext db,
        AppUser appUser)
    {
        var unreadMessages = query.Where(m => m.SenderId != appUser.Id
                                              && m.MessageReadTimes.SingleOrDefault(x => x.Id == appUser.Id) == null
        ).Include(x => x.MessageReadTimes);
        var unreadMessageIds = unreadMessages.Select(x => x.GroupChatId);
        var groupChatReadTimes = db.GroupChatReadTimes
            .Where(x => unreadMessageIds.Contains(x.GroupChatMessageId))
            .ToList();

        /*foreach (var readTime in groupChatReadTimes)
        {
            // var messageMessageReadTimes = message.MessageR
            // eadTimes.ToList();

            var newReadTime = new GroupChatReadTime
            {
                AppUserId = appUser.Id,
                AppUser = appUser,
                GroupChatMessageId = readTime.GroupChatMessageId,
                GroupChatMessage = readTime.GroupChatMessage,
                MessageReadTime = DateTime.Now
            };
readTime.MessageReadTime = DateTime.Now;
            readTime = newReadTime;
            // message.MessageReadTimes = message.MessageReadTimes.ToList().Add(newReadTime);
        }*/

        foreach (var message in unreadMessages)
        {
            var messageMessageReadTimes = message.MessageReadTimes.ToList();

            var newReadTime = new GroupChatReadTime
            {
                AppUserId = appUser.Id,
                AppUser = appUser,
                MessageReadTime = DateTime.Now
            };
            db.GroupChatReadTimes.Add(newReadTime);
            // db.SaveChanges();
            // if (message.MessageReadTimes.Any())
            // {
            //     message.MessageReadTimes = message.MessageReadTimes.A;
            // }
            // else
            // {
            // message.MessageReadTimes = new List<GroupChatReadTime> { newReadTime };
            // db.GroupChatReadTimes.Add(newReadTime);
            // db.SaveChanges();
            // }
            // message.MessageReadTimes = message.MessageReadTimes.ToList().Add(newReadTime);
        }


        // var dsa = db.Gr
        // query.


        return query;
    }
}