using Messages.API.Contracts.Data;
using Messages.API.Entities;

namespace Messages.API.Mapping;

public static class GroupChatReadTimesMapper
{
    public static GroupChatReadTimeDto ToDto(this GroupChatReadTime request)
    {
        return new GroupChatReadTimeDto
        {
            Id = request.Id.ToString(),
            RecipientDisplayName = request.User.DisplayName,
            MessageReadTime = request.MessageReadTime
        };
    }
}