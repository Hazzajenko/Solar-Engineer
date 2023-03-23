using FastEndpoints;
using Identity.Application.Handlers.AppUsers;
using Identity.Application.Mapping;
using Identity.Contracts.Responses;
using Infrastructure.Extensions;
using Mediator;

namespace Identity.API.Endpoints;

public class UserEndpoint : EndpointWithoutRequest<UserResponse>
{
    private readonly IMediator _mediator;

    public UserEndpoint(
        IMediator mediator)
    {
        _mediator = mediator;
    }


    public override void Configure()
    {
        Get("/user");
        AuthSchemes("bearer");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var user = await _mediator.Send(new GetAppUserQuery(User), cT);
        if (user is null)
        {
            Logger.LogError("Unable to find user {UserId}", User.GetUserId());
            await SendUnauthorizedAsync(cT);
            return;
        }

        Response.User = user.ToCurrentUserDto();
        await SendOkAsync(Response, cT);
    }
}