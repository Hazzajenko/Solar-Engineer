﻿using dotnetapi.Features.GroupChats.Entities;

namespace dotnetapi.Features.GroupChats.Mapping;

public static class GroupChatServerMessagesMapping
{
    public static GroupChatServerMessageDto ToDto(this GroupChatServerMessage request)
    {
        return new GroupChatServerMessageDto
        {
            Id = request.Id,
            GroupChatId = request.GroupChatId,
            // SenderUserName = "SERVER",
            Content = request.Content,
            MessageSentTime = request.MessageSentTime
            // MessageFrom = MessageFrom.Server
            // IsUserSender = false,
            // IsServer = true
        };
    }
}