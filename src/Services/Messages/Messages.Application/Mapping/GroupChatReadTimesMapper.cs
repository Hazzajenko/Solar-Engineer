using Messages.Contracts.Data;
using Messages.Domain.Entities;

namespace Messages.Application.Mapping;

public static class GroupChatReadTimesMapper
{
    public static GroupChatReadTimeDto ToDto(this GroupChatReadTime request)
    {
        return new GroupChatReadTimeDto
        {
            Id = request.Id.ToString(),
            RecipientId = request.UserId.ToString(),
            // RecipientDisplayName = request.User.DisplayName,
            MessageReadTime = request.MessageReadTime
        };
    }
}