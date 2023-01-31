using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Mapping;

public static class GroupChatMessagesMapping
{
    public static GroupChatMessageUpdateDto ToUpdateDto(this GroupChatMessage request)
    {
        return new GroupChatMessageUpdateDto
        {
            Id = request.Id,
            Changes = new GroupChatMessageChanges
            {
                SenderInGroup = request.SenderInGroup
            }
        };
    }
}