using dotnetapi.Features.Users.Contracts.Responses;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using MethodTimer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Users.Endpoints;

[Authorize]
[Time]
public class GetUserByUserNameEndpoint : EndpointWithoutRequest<GetUserResponse>
{
    private readonly ILogger<GetUserByUserNameEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public GetUserByUserNameEndpoint(
        ILogger<GetUserByUserNameEndpoint> logger,
        IMediator mediator,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("user/{username}");
        Policies("BeAuthenticated");
        // Roles("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var username = Route<string>("username");
        if (string.IsNullOrEmpty(username)) ThrowError("Invalid username");

        // var getUser = await _userManager.Users.Where(x => x.UserName == username).Select(x => x.ToGetUserDto()).SingleOrDefaultAsync(cT);
        var getUser = await _mediator.Send(new GetUserDtoByUserNameQuery(username), cT);
        if (getUser is null)
        {
            _logger.LogError("Bad request, GetUser UserName is invalid");
            ThrowError("GetUser UserName is invalid");
        }

        var response = new GetUserResponse
        {
            User = getUser
        };

        await SendOkAsync(response, cT);
    }
}