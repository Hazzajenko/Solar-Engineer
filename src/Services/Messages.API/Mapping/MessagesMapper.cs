using Messages.API.Contracts.Data;
using Messages.API.Contracts.Requests;
using Messages.API.Entities;

namespace Messages.API.Mapping;

public static class MessageMapper
{
    public static Message ToEntity(this SendMessageRequest request, User user, User recipient)
    {
        return new Message
        {
            Sender = user,
            Recipient = recipient,
            Content = request.Content
        };
    }

    public static MessageDto ToDto(this Message request, User appUser)
    {
        return new MessageDto
        {
            Id = request.Id.ToString(),
            Content = request.Content,
            MessageReadTime = request.MessageReadTime,
            MessageSentTime = request.MessageSentTime,
            /*RecipientUserName = request.RecipientUserName,
            SenderUserName = request.SenderUserName,*/
            // Status = request.Status,

            MessageReadTimes = request.MessageReadTime.HasValue
                ? new List<GroupChatReadTimeDto>
                {
                    new()
                    {
                        Id = "",
                        RecipientDisplayName = request.Recipient.DisplayName,
                        MessageReadTime = request.MessageReadTime.Value!
                    }
                }
                : new List<GroupChatReadTimeDto>(),
            MessageFrom =
                appUser.Id == request.Sender.Id
                    ? MessageFrom.CurrentUser
                    : MessageFrom.OtherUser,
            IsUserSender = appUser.Id == request.Id
        };
    }

    public static List<MessageDto> ToDtoList(this Message request, User appUser)
    {
        return new List<MessageDto>
        {
            request.ToDto(appUser)
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