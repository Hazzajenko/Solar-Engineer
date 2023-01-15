﻿using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Users;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Endpoints.Users;

[Authorize]
public class AcceptFriendEndpoint : EndpointWithoutRequest<AppUserFriendDto>
{
    private readonly ILogger<AcceptFriendEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;
    private readonly IUsersService _usersService;

    public AcceptFriendEndpoint(
        ILogger<AcceptFriendEndpoint> logger,
        IUsersService usersService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _usersService = usersService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("/users/accept/{username}");
    }

    public override async Task HandleAsync(CancellationToken cancellationToken)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var friendUsername = Route<string>("username");
        if (string.IsNullOrEmpty(friendUsername)) ThrowError("No username given");

        var acceptRequest = await _usersService.AcceptFriendAsync(user, friendUsername);

        _logger.LogInformation("{Username} accepted a friend request from {FriendUsername}", user.UserName,
            friendUsername);
        // return Ok(acceptRequest);

        await SendOkAsync(acceptRequest, cancellationToken);
    }
}