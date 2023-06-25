using Infrastructure.Logging;
using Messages.Contracts.Data;
using Messages.Contracts.Requests;
using Messages.Domain.Entities;

namespace Messages.Application.Mapping;

public static class MessageMapper
{
    public static Message ToEntity(this SendMessageRequest request, Guid senderId, Guid recipientId)
    {
        return new Message
        {
            /*Sender = user,
            Recipient = recipient,*/
            SenderId = senderId,
            RecipientId = recipientId,
            Content = request.Content
        };
    }

    public static MessageDto ToDto(this Message request, Guid appUserId)
    {
        return new MessageDto
        {
            Id = request.Id.ToString(),
            Content = request.Content,
            MessageReadTime = request.MessageReadTime,
            MessageSentTime = request.MessageSentTime,
            RecipientId = request.RecipientId.ToString(),
            SenderId = request.SenderId.ToString(),
            MessageReadTimes = request.MessageReadTime.HasValue
                ? new List<GroupChatReadTimeDto>
                {
                    new()
                    {
                        Id = "",
                        RecipientId = request.RecipientId.ToString(),
                        MessageReadTime = request.MessageReadTime.Value!
                    }
                }
                : new List<GroupChatReadTimeDto>(),
            MessageFrom =
                appUserId == request.SenderId
                    ? EMessageFrom.CurrentUser.Name
                    : EMessageFrom.OtherUser.Name,
            IsUserSender = appUserId == request.SenderId,
            OtherUserId =
                appUserId == request.SenderId
                    ? request.RecipientId.ToString()
                    : request.SenderId.ToString()
        };
    }

    public static List<MessageDto> ToDtoList(this Message request, Guid appUserId)
    {
        return new List<MessageDto> { request.ToDto(appUserId) };
    }

    public static MessagePreviewDto ToMessagePreviewDto(this Message request, Guid appUserId)
    {
        var lastMessageFrom =
            request.SenderId == appUserId
                ? EMessageFrom.CurrentUser.Name
                : EMessageFrom.OtherUser.Name;
        var lastMessageSenderId = request.SenderId.ToString();
        var otherUserId =
            request.SenderId == appUserId
                ? request.RecipientId.ToString()
                : request.SenderId.ToString();
        var isLastMessageReadByUser =
            lastMessageFrom == EMessageFrom.CurrentUser.Name || request.MessageReadTime.HasValue;
        return new UserMessagePreviewDto
        {
            Id = request.Id.ToString(),
            IsGroup = false,
            LastMessageContent = request.Content,
            OtherUserId = otherUserId,
            LastMessageFrom = lastMessageFrom,
            LastMessageSenderId = lastMessageSenderId,
            LastMessageSentTime = request.MessageSentTime,
            IsLastMessageUserSender = lastMessageFrom == EMessageFrom.CurrentUser.Name,
            IsLastMessageReadByUser = isLastMessageReadByUser,
        };
    }
}
