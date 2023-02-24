using Messages.API.Contracts.Data;
using Messages.API.Entities;

namespace Messages.API.Mapping;

public static class GroupChatServerMessagesMapping
{
    public static GroupChatServerMessageDto ToDto(this GroupChatServerMessage request)
    {
        return new GroupChatServerMessageDto
        {
            Id = request.Id.ToString(),
            GroupChatId = request.GroupChatId.ToString(),
            // SenderUserName = "SERVER",
            Content = request.Content,
            MessageSentTime = request.MessageSentTime
            // MessageFrom = MessageFrom.Server
            // IsUserSender = false,
            // IsServer = true
        };
    }

    public static GroupChatCombinedMessageDto ToCombinedDto(this GroupChatServerMessage request)
    {
        return new GroupChatCombinedMessageDto
        {
            Id = request.Id.ToString(),
            GroupChatId = request.GroupChatId.ToString(),
            // SenderUserName = "SERVER",
            Content = request.Content,
            MessageSentTime = request.MessageSentTime
            // MessageFrom = MessageFrom.Server
            // IsUserSender = false,
            // IsServer = true
        };
    }

    public static IEnumerable<GroupChatCombinedMessageDto> ToCombinedDtoList(this GroupChatServerMessage request)
    {
        return new List<GroupChatCombinedMessageDto>
        {
            request.ToCombinedDto()
        };
    }
}