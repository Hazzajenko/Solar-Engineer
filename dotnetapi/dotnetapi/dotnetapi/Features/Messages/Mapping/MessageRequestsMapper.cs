using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.Messages.Contracts.Requests;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Messages.Mapping;

public static class MessageRequestsMapper
{
    public static GroupChatMessage ToEntity(this SendGroupChatMessageRequest request, AppUser user,
        GroupChat groupChat)
    {
        return new GroupChatMessage
        {
            Content = request.Content,
            Sender = user,
            MessageSentTime = DateTime.Now,
            GroupChat = groupChat,
            MessageReadTimes = new List<GroupChatReadTime>()
        };
    }
    /*public static Message ToEntity(this SendMessageRequest request, AppUser user, AppUser recipient)
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

    public static MessageDto ToDto(this Message request)
    {
        return new MessageDto
        {
            Id = request.Id,
            Content = request.Content,
            MessageReadTime = request.MessageReadTime,
            MessageSentTime = request.MessageSentTime,
            RecipientUserName = request.RecipientUserName,
            SenderUserName = request.SenderUserName,
            Status = request.Status
        };
    }*/
}