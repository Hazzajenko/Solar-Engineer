using dotnetapi.Features.GroupChats.Contracts.Responses;
using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Mapping;

public static class GroupChatsMapping
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

    public static GroupChatMemberDto ToMemberDto(this AppUserGroupChat request)
    {
        return new GroupChatMemberDto
        {
            GroupChatId = request.GroupChatId,
            Username = request.AppUser.UserName!,
            FirstName = request.AppUser.FirstName,
            LastName = request.AppUser.LastName,
            JoinedAt = request.JoinedAt,
            Role = request.Role,
            LastActive = request.AppUser.LastActive
        };
    }

    public static GroupChatDto ToDto(this AppUserGroupChat request)
    {
        return new GroupChatDto
        {
            Id = request.Id,
            Name = request.GroupChat.Name,
            Members = new List<GroupChatMemberDto>()
        };
    }

    public static GroupChatWithoutMembersDto ToDtoWithoutMembers(this AppUserGroupChat request)
    {
        return new GroupChatWithoutMembersDto
        {
            Id = request.Id,
            Name = request.GroupChat.Name
        };
    }

    public static GroupChatDto ToDtoWithMembers(this AppUserGroupChat request,
        IEnumerable<GroupChatMemberDto> memberDtos)
    {
        return new GroupChatDto
        {
            Id = request.Id,
            Name = request.GroupChat.Name,
            Members = memberDtos
        };
    }

    public static GroupChatDto ToDto(this GroupChat request, IEnumerable<GroupChatMemberDto> memberDtos)
    {
        return new GroupChatDto
        {
            Id = request.Id,
            Name = request.Name,
            Members = memberDtos
        };
    }

    public static CreateGroupChatResponse ToResponse(this GroupChat request,
        IEnumerable<GroupChatMemberDto> memberDtos)
    {
        return new CreateGroupChatResponse
        {
            GroupChat = request.ToDto(memberDtos)
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