using Messages.API.Contracts.Data;
using Messages.API.Contracts.Requests;
using Messages.API.Entities;

namespace Messages.API.Mapping;

public static class GroupChatMessagesMapper
{
    public static GroupChatMessage ToEntity(this SendGroupChatMessageRequest request, User user, GroupChat groupChat)
    {
        return new GroupChatMessage
        {
            Sender = user,
            GroupChat = groupChat,
            Content = request.Content
        };
    }


    public static GroupChatMessageDto ToDto(this GroupChatMessage request, User appUser)
    {
        return new GroupChatMessageDto
        {
            Id = request.Id.ToString(),
            GroupChatId = request.GroupChatId.ToString(),
            Content = request.Content,
            SenderDisplayName = request.Sender.DisplayName,
            MessageSentTime = request.MessageSentTime,
            MessageReadTimes = request.MessageReadTimes.Any()
                ? request.MessageReadTimes.Select(x => x.ToDto())
                : new List<GroupChatReadTimeDto>(),
            MessageFrom =
                appUser.Id == request.Sender.Id
                    ? MessageFrom.CurrentUser
                    : MessageFrom.OtherUser
        };
    }

    public static List<GroupChatMessageDto> ToDtoList(this GroupChatMessage request, User appUser)
    {
        return new List<GroupChatMessageDto>
        {
            request.ToDto(appUser)
        };
    }

    public static GroupChatMessageDto ToOtherUsersDto(this GroupChatMessage request)
    {
        return new GroupChatMessageDto
        {
            Id = request.Id.ToString(),
            GroupChatId = request.GroupChatId.ToString(),
            SenderId = request.SenderId.ToString(),
            Content = request.Content,
            SenderDisplayName = request.Sender.DisplayName,
            MessageSentTime = request.MessageSentTime,
            MessageReadTimes = request.MessageReadTimes.Any()
                ? request.MessageReadTimes.Select(x => x.ToDto())
                : new List<GroupChatReadTimeDto>(),
            MessageFrom = MessageFrom.OtherUser
        };
    }

    public static List<GroupChatMessageDto> ToOtherUsersDtoList(this GroupChatMessage request)
    {
        return new List<GroupChatMessageDto>
        {
            request.ToOtherUsersDto()
        };
    }

    /*  public static GroupChatMessageDto ToOtherUsersDto(this GroupChatMessage request)
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