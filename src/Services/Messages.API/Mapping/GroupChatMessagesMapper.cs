using System.Text;
using Messages.API.Contracts.Data;
using Messages.API.Contracts.Requests;
using Messages.API.Entities;

namespace Messages.API.Mapping;

public static class GroupChatMessagesMapper
{
    public static GroupChatMessage ToEntity(this SendGroupChatMessageRequest request, Guid appUserId,
        GroupChat groupChat)
    {
        return new GroupChatMessage
        {
            // Sender = user,
            SenderId = appUserId,
            GroupChat = groupChat,
            Content = request.Content
        };
    }


    public static GroupChatMessageDto ToDto(this GroupChatMessage request, Guid appUserId)
    {
        return new GroupChatMessageDto
        {
            Id = request.Id.ToString(),
            GroupChatId = request.GroupChatId.ToString(),
            Content = request.Content,
            SenderId = request.SenderId.ToString(),
            // SenderDisplayName = request.Sender.DisplayName,
            MessageSentTime = request.MessageSentTime,
            MessageReadTimes = request.MessageReadTimes.Any()
                ? request.MessageReadTimes.Select(x => x.ToDto())
                : new List<GroupChatReadTimeDto>()
            /*MessageFrom =
                appUserId == request.SenderId
                    ? MessageFrom.CurrentUser
                    : MessageFrom.OtherUser*/
        };
    }

    public static GroupChatCombinedMessageDto ToCombinedDto(this GroupChatMessage request, Guid appUserId)
    {
        return new GroupChatCombinedMessageDto
        {
            Id = request.Id.ToString(),
            GroupChatId = request.GroupChatId.ToString(),
            Content = request.Content,
            SenderId = request.SenderId.ToString(),
            ServerMessage = request.ServerMessage,
            // SenderDisplayName = request.Sender.DisplayName,
            MessageSentTime = request.MessageSentTime,
            MessageReadTimes = request.MessageReadTimes.Any()
                ? request.MessageReadTimes.Select(x => x.ToDto())
                : new List<GroupChatReadTimeDto>()
            /*MessageFrom =
                appUserId == request.SenderId
                    ? MessageFrom.CurrentUser
                    : MessageFrom.OtherUser*/
        };
    }

    public static IEnumerable<GroupChatCombinedMessageDto> ToCombinedDtoList(this GroupChatMessage request,
        Guid appUserId)
    {
        return new List<GroupChatCombinedMessageDto>
        {
            request.ToCombinedDto(appUserId)
        };
    }

    public static List<GroupChatMessageDto> ToDtoList(this GroupChatMessage request, Guid appUserId)
    {
        return new List<GroupChatMessageDto>
        {
            request.ToDto(appUserId)
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
            // SenderDisplayName = request.Sender.DisplayName,
            MessageSentTime = request.MessageSentTime,
            MessageReadTimes = request.MessageReadTimes.Any()
                ? request.MessageReadTimes.Select(x => x.ToDto())
                : new List<GroupChatReadTimeDto>(),
            MessageFrom = MessageFrom.OtherUser
        };
    }

    public static GroupChatCombinedMessageDto ToOtherUsersCombinedDto(this GroupChatMessage request)
    {
        return new GroupChatCombinedMessageDto
        {
            Id = request.Id.ToString(),
            ServerMessage = request.ServerMessage,
            GroupChatId = request.GroupChatId.ToString(),
            SenderId = request.SenderId.ToString(),
            Content = request.Content,
            // SenderDisplayName = request.Sender.DisplayName,
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

    public static IEnumerable<GroupChatCombinedMessageDto> ToOtherUsersCombinedDtoList(this GroupChatMessage request)
    {
        return new List<GroupChatCombinedMessageDto>
        {
            request.ToOtherUsersCombinedDto()
        };
    }

    public static GroupChatServerMessage ToServerMessage(
        this IEnumerable<AppUserGroupChat> request,
        Guid appUserId
    )
    {
        return new GroupChatServerMessage
        {
            GroupChat = request.First().GroupChat,
            Content = PrintMembers(request, appUserId),
            MessageSentTime = DateTime.UtcNow
        };

        static string PrintMembers(IEnumerable<AppUserGroupChat> appUserGroupChats, Guid appUserId)
        {
            var memberIds = appUserGroupChats.Select(x => x.AppUserId.ToString());
            var sb = new StringBuilder();

            sb.Append($"{appUserId} invited ");
            foreach (var userName in memberIds)
            {
                sb.Append(userName);
                if (userName != memberIds.Last())
                    sb.Append(", ");
            }

            sb.Append($" to {appUserGroupChats.First().GroupChat.Name}");

            return sb.ToString();
        }
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