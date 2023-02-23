using FastEndpoints;
using Mediator;
using Messages.API.Contracts.Responses;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace Messages.API.Endpoints;

[Authorize]
public class GetLatestMessagesEndpoint : EndpointWithoutRequest<LatestUserMessagesResponse>
{
    private readonly IMediator _mediator;

    public GetLatestMessagesEndpoint(
        IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("messages");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }


        var messages = await _mediator.Send(new GetLatestUserMessagesQuery(appUser), ct);

        var response = new ManyLatestUserMessagesResponse
        {
            Messages = messages
        };

        await SendOkAsync(response, ct);
    }
}