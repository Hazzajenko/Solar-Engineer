using Messages.Contracts.Data;
using Messages.Contracts.Requests;
using Messages.Domain.Entities;

namespace Messages.Application.Mapping;

public static class AppUserGroupChatsMapping
{
    public static AppUserGroupChat ToDomain(this CreateGroupChatRequest request, Guid appUserId)
    {
        return new AppUserGroupChat
        {
            AppUserId = appUserId,
            Role = "Admin",
            CanInvite = true,
            CanKick = true,
            GroupChat = new GroupChat { Name = request.GroupChatName, CreatedById = appUserId }
        };
    }

    public static InitialGroupChatMemberDto ToInitialMemberDto(this AppUserGroupChat request)
    {
        return new InitialGroupChatMemberDto
        {
            GroupChatId = request.GroupChatId.ToString(),
            AppUserId = request.AppUserId.ToString(),
            // DisplayName = request.AppUser.DisplayName,
            JoinedAt = request.CreatedTime,
            Role = request.Role
        };
    }

    public static MessagePreviewDto ToMessagePreviewDto(
        this AppUserGroupChat request,
        Guid appUserId
    )
    {
        var groupChat = request.GroupChat;
        var lastMessage = groupChat.GroupChatMessages.MaxBy(o => o.MessageSentTime)!;
        lastMessage.ThrowHubExceptionIfNull();
        var lastMessageFrom = lastMessage.ServerMessage
            ? EMessageFrom.Server.Name
            : lastMessage.SenderId == appUserId
                ? EMessageFrom.CurrentUser.Name
                : EMessageFrom.OtherUser.Name;
        var lastMessageSenderId =
            lastMessage.SenderId == appUserId
                ? appUserId.ToString()
                : lastMessage.SenderId.ToString();
        var lastMessageSentTime = lastMessage?.MessageSentTime ?? DateTime.MinValue;
        var isLastMessageReadByUser = lastMessage?.MessageReadTimes.FirstOrDefault(
            x => x.UserId == appUserId
        );
        return new GroupChatMessagePreviewDto
        {
            Id = groupChat.Id.ToString(),
            IsGroup = true,
            GroupChatName = groupChat.Name,
            GroupChatPhotoUrl = groupChat.PhotoUrl,
            LastMessageContent = lastMessage?.Content ?? "",
            LastMessageFrom = lastMessageFrom,
            LastMessageSenderId = lastMessageSenderId,
            LastMessageSentTime = lastMessageSentTime,
            IsLastMessageUserSender = lastMessageFrom == EMessageFrom.CurrentUser.Name,
            IsLastMessageReadByUser = isLastMessageReadByUser is not null
        };
    }
}
