using dotnetapi.Data;
using dotnetapi.Extensions;
using dotnetapi.Features.Messages.Contracts.Requests;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Messages.Services;

public interface IMessagesRepository
{
    Task<Message> AddMessageAsync(Message message);
    Task<IEnumerable<Message>> GetMessagesAsync(AppUser appUser);
    Task<IEnumerable<MessageDto>> GetMessageDtosAsync(AppUser appUser);
    Task<IEnumerable<MessageDto>> GetMessageDtosWithFilterAsync(AppUser appUser, MessageFilter? filter);
    Task<bool> RemoveMessage(Message message);
    Task<bool> UpdateMessageAsync(UpdateMessageRequest request);

    Task<IEnumerable<MessageDto>> GetUserMessagesAsync(AppUser appUser,
        AppUser recipientUser);

    Task<GroupChatMessageDto> SendMessageToGroupChatAsync(GroupChatMessage message, AppUser appUser);
    Task<IEnumerable<GroupChatMessageDto>?> GetGroupChatMessagesAsync(int groupChatId, AppUser appUser);
    Task<bool> MarkAllGroupChatMessagesReadByUser(UpdateManyGroupChatMessagesRequest request, AppUser appUser);

    Task<bool> MarkAllGroupChatMessagesReadByUserAsync(List<int> messageIds,
        AppUser appUser);
}

public class MessagesRepository : IMessagesRepository
{
    private readonly DataContext _context;

    public MessagesRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Message> AddMessageAsync(Message message)
    {
        await _context.Messages.AddAsync(message);
        await _context.SaveChangesAsync();
        return message;
    }

    public async Task<IEnumerable<Message>> GetMessagesAsync(AppUser appUser)
    {
        var messagesSent = await _context.Messages
            .Where(x => x.SenderUsername == appUser.UserName!)
            .Include(x => x.Recipient)
            .ToListAsync();

        var messagesReceived = await _context.Messages
            .Where(x => x.RecipientUsername == appUser.UserName!)
            .Include(x => x.Sender)
            .ToListAsync();

        messagesSent.AddRange(messagesReceived);
        return messagesSent;
    }

    public async Task<IEnumerable<MessageDto>> GetMessageDtosAsync(AppUser appUser)
    {
        var messagesSent = await _context.Messages
            .Where(x => x.SenderUsername == appUser.UserName!)
            .Include(x => x.Recipient)
            .Select(x => x.ToDto(appUser))
            .ToListAsync();

        var messagesReceived = await _context.Messages
            .Where(x => x.RecipientUsername == appUser.UserName!)
            .Include(x => x.Sender)
            .Select(x => x.ToDto(appUser))
            .ToListAsync();

        messagesSent.AddRange(messagesReceived);
        return messagesSent;
    }

    public async Task<bool> RemoveMessage(Message message)
    {
        _context.Messages.Remove(message);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<MessageDto>> GetMessageDtosWithFilterAsync(AppUser appUser, MessageFilter? filter)
    {
        if (filter is null) return await GetMessageDtosAsync(appUser);

        switch (filter)
        {
            case MessageFilter.Sent:
                return await _context.Messages
                    .Where(x => x.SenderUsername == appUser.UserName!)
                    .Include(x => x.Recipient)
                    .Select(x => x.ToDto(appUser))
                    .ToListAsync();
            case MessageFilter.Received:
                return await _context.Messages
                    .Where(x => x.RecipientUsername == appUser.UserName!)
                    .Include(x => x.Sender)
                    .Select(x => x.ToDto(appUser))
                    .ToListAsync();
            default:
                return await GetMessageDtosAsync(appUser);
        }
    }

    public async Task<bool> UpdateMessageAsync(UpdateMessageRequest request)
    {
        var message = await _context.Messages.Where(x => x.Id == request.Id).SingleOrDefaultAsync();

        if (message is null) return false;

        if (request.Changes.Status is not null)
        {
            message.Status = request.Changes.Status.Value;
            message.MessageReadTime = DateTime.Now;
        }

        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<MessageDto>> GetUserMessagesAsync(AppUser appUser,
        AppUser recipientUser)
    {
        return await _context.Messages
            .Where(m => (m.Recipient.UserName == appUser.UserName && m.RecipientDeleted == false
                                                                  && m.Sender.UserName == recipientUser.UserName)
                        || (m.Recipient.UserName == recipientUser.UserName
                            && m.Sender.UserName == appUser.UserName && m.SenderDeleted == false)
            )
            .MarkUnreadAsRead(appUser.UserName!)
            .OrderBy(m => m.MessageSentTime)
            .Select(x => x.ToDto(appUser))
            .ToListAsync();
    }

    public async Task<IEnumerable<GroupChatMessageDto>?> GetGroupChatMessagesAsync(int groupChatId, AppUser appUser)
    {
        return await _context.GroupChats
            .Where(m => m.Id == groupChatId)
            .Include(x => x.GroupChatMessages)
            .ThenInclude(x => x.Sender)
            .Include(x => x.GroupChatMessages)
            .ThenInclude(x => x.MessageReadTimes)
            .Select(x => x.GroupChatMessages
                .OrderBy(groupChatMessage => groupChatMessage.MessageSentTime)
                .Select(groupChatMessage => groupChatMessage.ToDto(appUser))
            )
            .SingleOrDefaultAsync();
    }

    public async Task<bool> MarkAllGroupChatMessagesReadByUser(UpdateManyGroupChatMessagesRequest request,
        AppUser appUser)
    {
        var messageIds = request.Updates.Select(x => x.Id).ToList();

        var messages = await _context.GroupChatMessages.Where(x => messageIds.Contains(x.Id)).ToListAsync();

        foreach (var groupChatMessage in messages)
        {
            var readTimes = groupChatMessage.MessageReadTimes.ToList();
            var hasUserAlreadyRead = readTimes.SingleOrDefault(x => x.AppUserId == appUser.Id);
            if (hasUserAlreadyRead is not null) continue;
            readTimes.Add(new GroupChatReadTime
            {
                AppUser = appUser,
                GroupChatMessage = groupChatMessage,
                MessageReadTime = DateTime.Now
            });
        }

        var res = await _context.SaveChangesAsync();
        return res > 0;
    }

    public async Task<bool> MarkAllGroupChatMessagesReadByUserAsync(List<int> messageIds,
        AppUser appUser)
    {
        var messages = await _context.GroupChatMessages
            .Where(x => messageIds.Contains(x.Id))
            .Include(x => x.MessageReadTimes)
            .ToListAsync();

        foreach (var groupChatMessage in messages)
        {
            var readTimes = groupChatMessage.MessageReadTimes.ToList();
            var hasUserAlreadyRead = readTimes.SingleOrDefault(x => x.AppUserId == appUser.Id);
            if (hasUserAlreadyRead is not null) continue;
            var newReadTime = new GroupChatReadTime
            {
                AppUser = appUser,
                GroupChatMessage = groupChatMessage,
                MessageReadTime = DateTime.Now
            };
            /*readTimes.Add(new GroupChatReadTime
            {
                AppUser = appUser,
                GroupChatMessage = groupChatMessage,
                MessageReadTime = DateTime.Now
            });*/
            await _context.GroupChatReadTimes.AddAsync(newReadTime);
        }

        var res = await _context.SaveChangesAsync();
        return res > 0;
    }


    public async Task<GroupChatMessageDto> SendMessageToGroupChatAsync(GroupChatMessage message, AppUser appUser)
    {
        await _context.GroupChatMessages.AddAsync(message);
        await _context.SaveChangesAsync();
        return message.ToDto(appUser);
    }
}