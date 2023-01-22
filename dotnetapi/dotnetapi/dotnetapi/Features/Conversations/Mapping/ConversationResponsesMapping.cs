using dotnetapi.Features.Conversations.Contracts.Responses;
using dotnetapi.Features.Conversations.Entities;

namespace dotnetapi.Features.Conversations.Mapping;

public static class ConversationResponsesMapping
{
    /*public static Conversation ToEntity(this SendMessageRequest request, AppUser user, AppUser recipient)
    {
        return new Message
        {
            Content = request.Content,
            RecipientUsername = recipient.UserName!,
            SenderUsername = user.UserName!,
            Sender = user,
            Recipient = recipient,
            Status = NotificationStatus.Unread
        };
    }*/

    public static InviteToConversationResponse ToInviteMemberResponse(this AppUserConversation request)
    {
        return new InviteToConversationResponse
        {
            Member = new ConversationMemberDto
            {
                Username = request.AppUser.UserName!,
                FirstName = request.AppUser.FirstName,
                LastName = request.AppUser.LastName,
                JoinedConversationAt = request.JoinedAt,
                Role = request.Role,
                LastActive = request.AppUser.LastActive
            }
        };
    }
}
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
                Username = user.UserName!,
                LastName = user.LastName,
                JoinedConversationAt = DateTime.Now
            }
        }
    }
}*/