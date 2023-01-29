using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Mapping;

public static class GroupChatMessageSortMapping
{
    public static GroupChatMessageSort ToMessageSort(this GroupChatMessage request)
    {
        return new GroupChatMessageSort
        {
            Id = request.Id,
            MessageType = MessageType.Message,
            MessageSentTime = request.MessageSentTime
        };
    }

    public static GroupChatMessageSort ToMessageSort(this GroupChatServerMessage request)
    {
        return new GroupChatMessageSort
        {
            Id = request.Id,
            MessageType = MessageType.ServerMessage,
            MessageSentTime = request.MessageSentTime
        };
    }
}