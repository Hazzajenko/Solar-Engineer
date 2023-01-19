﻿using dotnetapi.Features.Messages.Contracts.Responses;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Messages.GetConversation;

[Authorize]
public class GetUserConversationEndpoint : EndpointWithoutRequest<ConversationMessagesResponse>
{
    private readonly ILogger<GetUserConversationEndpoint> _logger;
    private readonly IMessagesRepository _messagesRepository;
    private readonly UserManager<AppUser> _userManager;

    public GetUserConversationEndpoint(
        ILogger<GetUserConversationEndpoint> logger,
        IMessagesRepository messagesRepository,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _messagesRepository = messagesRepository;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("messages/user/{recipientUsername}");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var recipientUsername = Route<string>("recipientUsername");
        if (string.IsNullOrEmpty(recipientUsername)) ThrowError("Invalid recipientUsername");

        var recipient = await _userManager.Users.Where(x => x.UserName == recipientUsername).SingleOrDefaultAsync(ct);
        if (recipient is null)
        {
            _logger.LogError("Bad request, Recipient is invalid");
            ThrowError("Recipient is invalid");
        }

        var conversationMessages = await _messagesRepository.GetUserConversationAsync(user, recipient);

        var response = new ConversationMessagesResponse
        {
            MessagesWith = recipientUsername,
            Messages = conversationMessages
        };

        await SendOkAsync(response, ct);
    }
}