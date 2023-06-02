/*using EventBus.Domain.AppUserEvents;
using FastEndpoints;
using Marten;

// using MassTransit.Mediator;

namespace Identity.API.Endpoints.Events;

// public class PingEndpoint : EndpointWithoutRequest<Acknowledgement>
// public class PingEndpoint : EndpointWithoutRequest<string>

public record GetEventByIdRequest(Guid Id);

public class GetEventByIdEndpoint : Endpoint<GetEventByIdRequest, AppUserEventV2>
{
    private readonly IDocumentSession _session;

    public GetEventByIdEndpoint(IDocumentSession session)
    {
        _session = session;
    }

    public override void Configure()
    {
        Get("/events/{@Id}", x => new { x.Id });
        AllowAnonymous();
    }

    public override async Task HandleAsync(GetEventByIdRequest req, CancellationToken cT)
    {
        var appUserEvent = await _session.LoadAsync<AppUserEventV2>(req.Id, cT);

        if (appUserEvent is null)
        {
            await SendNotFoundAsync(cT);
            return;
        }

        await SendOkAsync(appUserEvent, cT);
    }
}*/

