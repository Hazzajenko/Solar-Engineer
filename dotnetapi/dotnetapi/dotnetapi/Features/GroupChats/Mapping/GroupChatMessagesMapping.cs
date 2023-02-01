using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Handlers;
using dotnetapi.Features.GroupChats.Handlers.InitialGroupChats;
using dotnetapi.Features.Messages.Contracts.Requests;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using GroupChatMessageChanges = dotnetapi.Features.GroupChats.Entities.GroupChatMessageChanges;

namespace dotnetapi.Features.GroupChats.Mapping;

public static class GroupChatMessagesMapping
{
    public static GroupChatMessageUpdateDto ToUpdateDto(this GroupChatMessage request)
    {
        return new GroupChatMessageUpdateDto
        {
            Id = request.Id,
            Changes = new GroupChatMessageChanges { SenderInGroup = request.SenderInGroup }
        };
    }

    public static SendMessageToGroupChatQuery ToSendGroupChatMessageQuery(
        this SendGroupChatMessageRequest request,
        AppUser appUser,
        GroupChat groupChat
    )
    {
        return new SendMessageToGroupChatQuery(request.ToEntity(appUser, groupChat), appUser);
    }

    public static GetGroupChatMemberUserNamesQuery ToGroupChatMemberUserNamesQuery(
        this SendGroupChatMessageRequest request,
        AppUser? appUser = null
    )
    {
        return new GetGroupChatMemberUserNamesQuery(request.GroupChatId, appUser);
    }
}