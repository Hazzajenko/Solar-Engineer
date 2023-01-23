using dotnetapi.Features.Messages.Contracts.Requests;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Messages.Mapping;

public static class MessageMapper
{
    public static Message ToEntity(this SendMessageRequest request, AppUser user, AppUser recipient)
    {
        return new Message
        {
            Content = request.Content,
            RecipientUsername = recipient.UserName!,
            SenderUsername = user.UserName!,
            Sender = user,
            Recipient = recipient,
            Status = NotificationStatus.Unread
        };
    }

    public static MessageDto ToDto(this Message request)
    {
        return new MessageDto
        {
            Id = request.Id,
            Content = request.Content,
            MessageReadTime = request.MessageReadTime,
            MessageSentTime = request.MessageSentTime,
            RecipientUsername = request.RecipientUsername,
            SenderUsername = request.SenderUsername,
            Status = request.Status
        };
    }

    public static GroupChatMessageDto ToDto(this GroupChatMessage request)
    {
        return new GroupChatMessageDto
        {
            Id = request.Id,
            Content = request.Content,
            SenderUsername = request.Sender.UserName!,
            MessageSentTime = request.MessageSentTime,
            GroupChatId = request.GroupChatId,
            MessageReadTimes = request.MessageReadTimes.Select(x => x.ToDto())
        };
    }

    public static GroupChatReadTimeDto ToDto(this GroupChatReadTime request)
    {
        return new GroupChatReadTimeDto
        {
            Id = request.Id,
            RecipientUsername = request.AppUser.UserName!,
            MessageReadTime = request.MessageReadTime
        };
    }
}