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
                    ? MessageFrom.CurrentUser
                    : MessageFrom.OtherUser,
            IsUserSender = appUserId == request.SenderId
        };
    }

    public static List<MessageDto> ToDtoList(this Message request, Guid appUserId)
    {
        return new List<MessageDto>
        {
            request.ToDto(appUserId)
        };
    }

    /*public static GroupChatMessageDto ToDto(this GroupChatMessage request, AppUser appUser)
    {
        return new GroupChatMessageDto
        {
            Id = request.Id,
            GroupChatId = request.GroupChatId,
            Content = request.Content,
            SenderDisplayName = request.Sender.UserName!,
            MessageSentTime = request.MessageSentTime,
            MessageReadTimes = request.MessageReadTimes.Any()
                ? request.MessageReadTimes.Select(x => x.ToDto())
                : new List<GroupChatReadTimeDto>(),
            // IsUserSender = appUser.UserName! == request.Sender.UserName!,
            // IsServer = false,
            MessageFrom =
                appUser.UserName! == request.Sender.UserName!
                    ? MessageFrom.CurrentUser
                    : MessageFrom.OtherUser
        };
    }

    public static GroupChatMessageDto ToOtherUsersDto(this GroupChatMessage request)
    {
        return new GroupChatMessageDto
        {
            Id = request.Id,
            GroupChatId = request.GroupChatId,
            Content = request.Content,
            SenderDisplayName = request.Sender.UserName!,
            MessageSentTime = request.MessageSentTime,
            MessageReadTimes = request.MessageReadTimes.Any()
                ? request.MessageReadTimes.Select(x => x.ToDto())
                : new List<GroupChatReadTimeDto>(),
            // IsUserSender = appUser.UserName! == request.Sender.UserName!,
            // IsServer = false,
            MessageFrom = MessageFrom.OtherUser
        };
    }

    public static GroupChatReadTimeDto ToDto(this GroupChatReadTime request)
    {
        return new GroupChatReadTimeDto
        {
            Id = request.Id,
            RecipientDisplayName = request.AppUser.UserName!,
            MessageReadTime = request.MessageReadTime
        };
    }*/
}