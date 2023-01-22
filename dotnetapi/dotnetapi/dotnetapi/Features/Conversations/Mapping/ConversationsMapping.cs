using dotnetapi.Features.Conversations.Contracts.Responses;
using dotnetapi.Features.Conversations.Entities;

namespace dotnetapi.Features.Conversations.Mapping;

public static class ConversationsMapping
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

    public static ConversationMemberDto ToMemberDto(this AppUserConversation request)
    {
        return new ConversationMemberDto
        {
            Username = request.AppUser.UserName!,
            FirstName = request.AppUser.FirstName,
            LastName = request.AppUser.LastName,
            JoinedConversationAt = request.JoinedAt,
            Role = request.Role,
            LastActive = request.AppUser.LastActive
        };
    }

    public static ConversationDto ToDto(this Conversation request, IEnumerable<ConversationMemberDto> memberDtos)
    {
        return new ConversationDto
        {
            Id = request.Id,
            Name = request.Name,
            Members = memberDtos
        };
    }

    public static CreateConversationResponse ToResponse(this Conversation request,
        IEnumerable<ConversationMemberDto> memberDtos)
    {
        return new CreateConversationResponse
        {
            Conversation = request.ToDto(memberDtos)
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