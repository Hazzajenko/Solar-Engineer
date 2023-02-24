﻿using Messages.API.Contracts.Data;
using Messages.API.Contracts.Requests;
using Messages.API.Entities;

namespace Messages.API.Mapping;

public static class AppUserGroupChatsMapping
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

    public static AppUserGroupChat ToDomain(this CreateGroupChatRequest request, Guid appUserId)
    {
        return new AppUserGroupChat
        {
            AppUserId = appUserId,
            Role = "Admin",
            CanInvite = true,
            CanKick = true,
            GroupChat = new GroupChat
            {
                Name = request.GroupChatName,
                CreatedById = appUserId
                // PhotoUrl = appUser.PhotoUrl,
                // Created = DateTime.Now
            }
        };
    }


    public static InitialGroupChatMemberDto ToInitialMemberDto(this AppUserGroupChat request)
    {
        return new InitialGroupChatMemberDto
        {
            Id = request.Id.ToString(),
            GroupChatId = request.GroupChatId.ToString(),
            AppUserId = request.AppUserId.ToString(),
            // DisplayName = request.AppUser.DisplayName,
            JoinedAt = request.CreatedTime,

            Role = request.Role
        };
    }

    /*public static GroupChatMemberDto ToMemberDto(this AppUserGroupChat request)
    {
        return new GroupChatMemberDto
        {
            Id = request.Id,
            GroupChatId = request.GroupChatId,
            UserId = request.AppUser.Id,
            DisplayName = request.AppUser.DisplayName,
            FirstName = request.AppUser.FirstName,
            LastName = request.AppUser.LastName,
            PhotoUrl = request.AppUser.PhotoUrl,
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
            PhotoUrl = request.GroupChat.PhotoUrl,
            Created = request.GroupChat.Created,
            Members = new List<GroupChatMemberDto>()
        };
    }

    public static GroupChatWithoutMembersDto ToDtoWithoutMembers(this AppUserGroupChat request)
    {
        return new GroupChatWithoutMembersDto
        {
            Id = request.GroupChatId,
            Name = request.GroupChat.Name,
            PhotoUrl = request.GroupChat.PhotoUrl,
            Created = request.GroupChat.Created
        };
    }

    public static GroupChatDto ToDtoWithMembers(this AppUserGroupChat request,
        IEnumerable<GroupChatMemberDto> memberDtos)
    {
        return new GroupChatDto
        {
            Id = request.Id,
            Name = request.GroupChat.Name,
            PhotoUrl = request.GroupChat.PhotoUrl,
            Created = request.GroupChat.Created,
            Members = memberDtos
        };
    }

    public static GroupChatDto ToResponseDto(this AppUserGroupChat request,
        IEnumerable<GroupChatMemberDto> memberDtos, IEnumerable<GroupChatServerMessageDto> serverMessageDtos)
    {
        return new GroupChatDto
        {
            Id = request.Id,
            Name = request.GroupChat.Name,
            PhotoUrl = request.GroupChat.PhotoUrl,
            Created = request.GroupChat.Created,
            Members = memberDtos,
            ServerMessages = serverMessageDtos
        };
    }

    public static InitialGroupChatDto ToInitialResponseDto(this AppUserGroupChat request,
        IEnumerable<InitialGroupChatMemberDto> memberDtos, IEnumerable<GroupChatServerMessageDto> serverMessageDtos)
    {
        return new InitialGroupChatDto
        {
            Id = request.Id,
            Name = request.GroupChat.Name,
            PhotoUrl = request.GroupChat.PhotoUrl,
            Created = request.GroupChat.Created,
            Members = memberDtos,
            ServerMessages = serverMessageDtos
        };
    }

    public static GroupChatDto ToDto(this GroupChat request, IEnumerable<GroupChatMemberDto> memberDtos)
    {
        return new GroupChatDto
        {
            Id = request.Id,
            Name = request.Name,
            PhotoUrl = request.PhotoUrl,
            Created = request.Created,
            Members = memberDtos
        };
    }*/

    /*public static CreateGroupChatResponse ToResponse(this GroupChat request,
        IEnumerable<GroupChatMemberDto> memberDtos)
    {
        return new CreateGroupChatResponse
        {
            GroupChat = request.ToDto(memberDtos)
        };
    }*/
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
                UserName = user.UserName!,
                LastName = user.LastName,
                JoinedConversationAt = DateTime.Now
            }
        }
    }
}*/