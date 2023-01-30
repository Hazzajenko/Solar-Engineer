using System.Data.Entity.Core.Objects;
using System.Reflection;
using System.Text;
using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Extensions;

public static class QueryableExtensions
{
    public static IQueryable<Message> MarkUnreadAsRead(this IQueryable<Message> query, string currentUsername)
    {
        var unreadMessages = query.Where(m => m.MessageReadTime == null
                                              && m.RecipientUserName == currentUsername);

        if (unreadMessages.Any())
            foreach (var message in unreadMessages)
                message.MessageReadTime = DateTime.UtcNow;

        return query;
    }

    /// <summary>
    ///     For an Entity Framework IQueryable, returns the SQL with inlined Parameters.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="query"></param>
    /// <returns></returns>
    public static string? ToTraceQuery<T>(this IQueryable<T> query)
    {
        var objectQuery = GetQueryFromQueryable(query);

        var result = objectQuery?.ToTraceString();
        foreach (var parameter in objectQuery?.Parameters!)
        {
            var name = "@" + parameter.Name;
            var value = "'" + parameter.Value + "'";
            result = result?.Replace(name, value);
        }

        return result;
    }

    /// <summary>
    ///     For an Entity Framework IQueryable, returns the SQL and Parameters.
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="query"></param>
    /// <returns></returns>
    public static string ToTraceString<T>(this IQueryable<T> query)
    {
        var objectQuery = GetQueryFromQueryable(query);

        var traceString = new StringBuilder();

        traceString.AppendLine(objectQuery?.ToTraceString());
        traceString.AppendLine();

        foreach (var parameter in objectQuery?.Parameters!)
            traceString.AppendLine(parameter.Name + " [" + parameter.ParameterType.FullName + "] = " + parameter.Value);

        return traceString.ToString();
    }

    private static ObjectQuery<T>? GetQueryFromQueryable<T>(IQueryable<T> query)
    {
        var internalQueryField = query.GetType().GetFields(BindingFlags.NonPublic | BindingFlags.Instance)
            .FirstOrDefault(f => f.Name.Equals("_internalQuery"));
        var internalQuery = internalQueryField?.GetValue(query);
        var objectQueryField = internalQuery?.GetType().GetFields(BindingFlags.NonPublic | BindingFlags.Instance)
            .FirstOrDefault(f => f.Name.Equals("_objectQuery"));
        return objectQueryField?.GetValue(internalQuery) as ObjectQuery<T>;
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