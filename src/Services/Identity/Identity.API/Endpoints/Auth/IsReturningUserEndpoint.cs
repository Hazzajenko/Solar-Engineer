﻿using ApplicationCore.Entities;
using ApplicationCore.Events.AppUsers;
using ApplicationCore.Extensions;
using FastEndpoints;
using Identity.Application.Logging;
using Identity.Application.Services.Jwt;
using Identity.Contracts.Data;
using Identity.Contracts.Responses;
using Identity.Domain;
using Infrastructure.Extensions;
using Infrastructure.Logging;
using Mapster;
using MassTransit;
using Mediator;
using Microsoft.ApplicationInsights;
using Microsoft.AspNetCore.Identity;
using Serilog.Core;

namespace Identity.API.Endpoints.Auth;

public class IsReturningUserEndpoint : EndpointWithoutRequest<AuthorizeResponse>
{
    private readonly IBus _bus;
    private readonly IJwtTokenGenerator _jwtTokenGenerator;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    private readonly TelemetryClient _telemetryClient;

    public IsReturningUserEndpoint(
        IMediator mediator,
        IJwtTokenGenerator jwtTokenGenerator,
        IBus bus,
        UserManager<AppUser> userManager,
        TelemetryClient telemetryClient
    )
    {
        _mediator = mediator;
        _jwtTokenGenerator = jwtTokenGenerator;
        _bus = bus;
        _userManager = userManager;
        _telemetryClient = telemetryClient;
    }

    public override void Configure()
    {
        Post("/returning-user");
        AuthSchemes("bearer");
        Summary(x =>
        {
            x.Summary = "Check if user is returning";
            x.Description = "Check if user is returning";
            x.Response<AuthorizeResponse>(200, "Success");
            x.Response(401, "Unauthorized");
        });
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        AppUser? appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            NonAuthenticatedUser nonAuthUser = User.TryGetUserIdAndName();
            Logger.LogUserNotFound(nonAuthUser.UserId, nonAuthUser.UserName);
            await SendUnauthorizedAsync(cT);
            return;
        }

        var token = _jwtTokenGenerator.GenerateToken(appUser.Id, appUser.UserName);

        var message = new UserLoggedIn(
            appUser.Id,
            appUser.UserName,
            appUser.DisplayName,
            appUser.PhotoUrl
        );
        await _bus.Publish(message, cT);

        var user = appUser.Adapt<AppUserDto>();

        using IDisposable? scope = Logger.BeginScope(appUser.GetUserDictionary());
        Logger.LogInformation("User {UserName}: Returning User Signed In", user.UserName);

        _telemetryClient.TrackEvent(
            "UserLoggedIn",
            new Dictionary<string, string>
            {
                { "UserId", appUser.Id.ToString() },
                { "UserName", appUser.UserName },
            }
        );

        Response.Token = token;
        Response.User = user;
        await SendOkAsync(Response, cT);
    }
}
