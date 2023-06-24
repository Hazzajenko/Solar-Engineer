﻿using ApplicationCore.Entities;
using Identity.Domain;
using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.Friends;

public sealed record SendFriendRequestCommand(AuthUser AuthUser, string RecipientUserId)
    : ICommand<bool>;
