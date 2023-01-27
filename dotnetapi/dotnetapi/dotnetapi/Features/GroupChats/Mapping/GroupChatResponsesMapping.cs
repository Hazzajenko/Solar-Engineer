using dotnetapi.Features.GroupChats.Contracts.Responses;
using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Mapping;

public static class GroupChatResponsesMapping
{
    /*public static Conversation ToEntity(this SendMessageRequest request, AppUser user, AppUser recipient)
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
    }*/

    public static InviteToGroupChatResponse ToInviteMemberResponse(this AppUserGroupChat request)
    {
        return new InviteToGroupChatResponse
        {
            Member = new GroupChatMemberDto
            {
                UserName = request.AppUser.UserName!,
                FirstName = request.AppUser.FirstName,
                LastName = request.AppUser.LastName,
                JoinedAt = request.JoinedAt,
                Role = request.Role,
                LastActive = request.AppUser.LastActive
            }
        };
    }

    /*
    public static CreateGroupChatResponse ToInviteMemberResponse(this AppUserGroupChat request)
    {
        return new CreateGroupChatResponse
        {
            GroupChat =
                Member = new GroupChatMemberDto
                {
                    UserName = request.AppUser.UserName!,
                    FirstName = request.AppUser.FirstName,
                    LastName = request.AppUser.LastName,
                    JoinedAt = request.JoinedAt,
                    Role = request.Role,
                    LastActive = request.AppUser.LastActive
                }
        };
    }*/
}
/*var response = new CreateGroupChatResponse
{
    GroupChat = new GroupChatDto
    {
        Id = result.Id,
        Name = result.Name,
        Members = new List<GroupChatMemberDto>
        {
            new()
            {
                FirstName = user.FirstName,
                Role = "Admin",
                UserName = user.UserName!,
                LastName = user.LastName,
                JoinedAt = DateTime.Now
            }
        }
    }
};*/
/*response = new CreateConversationResponse
{
    Conversation = new ConversationDto
    {
        Id = result.Id,
        Name = result.Name,
        Members = new List<ConversationMemberDto>
        {
            new()
            {
                FirstName = user.FirstName,
                Role = "Admin",
                UserName = user.UserName!,
                LastName = user.LastName,
                JoinedConversationAt = DateTime.Now
            }
        }
    }
}*/