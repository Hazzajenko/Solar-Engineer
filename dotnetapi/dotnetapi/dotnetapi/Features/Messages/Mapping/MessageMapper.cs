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
            RecipientUserName = recipient.UserName!,
            SenderUserName = user.UserName!,
            Sender = user,
            Recipient = recipient,
            Status = NotificationStatus.Unread
        };
    }

    public static MessageDto ToDto(this Message request, AppUser appUser)
    {
        return new MessageDto
        {
            Id = request.Id,
            Content = request.Content,
            MessageReadTime = request.MessageReadTime,
            MessageSentTime = request.MessageSentTime,
            RecipientUserName = request.RecipientUserName,
            SenderUserName = request.SenderUserName,
            Status = request.Status,
            IsUserSender = appUser.UserName! == request.SenderUserName!
        };
    }

    public static GroupChatMessageDto ToDto(this GroupChatMessage request, AppUser appUser)
    {
        return new GroupChatMessageDto
        {
            Id = request.Id,
            Content = request.Content,
            SenderUserName = request.Sender.UserName!,
            MessageSentTime = request.MessageSentTime,
            GroupChatId = request.GroupChatId,
            MessageReadTimes = request.MessageReadTimes.Select(x => x.ToDto()),
            IsUserSender = appUser.UserName! == request.Sender.UserName!
        };
    }

    public static GroupChatReadTimeDto ToDto(this GroupChatReadTime request)
    {
        return new GroupChatReadTimeDto
        {
            Id = request.Id,
            RecipientUserName = request.AppUser.UserName!,
            MessageReadTime = request.MessageReadTime
        };
    }
}