using FastEndpoints;
using Infrastructure.Extensions;
using Mediator;
using Users.API.Contracts.Requests;
using Users.API.Handlers;

namespace Users.API.Endpoints;

public class UserEventEndpoint : Endpoint<UserEventRequest>
{
    private readonly IMediator _mediator;

    public UserEventEndpoint(
        IMediator mediator
    )
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("/users/{@userId:int}/event", x => new { x.UserId });
    }

    public override async Task HandleAsync(UserEventRequest request, CancellationToken cT)
    {
        Logger.LogInformation("User {User} sent {Event} to User {Recipient}", User.GetUserId(), request.Event,
            request.UserId);
        await _mediator.Send(new UserEventCommand(User, request), cT);
        await SendNoContentAsync(cT);
    }
}