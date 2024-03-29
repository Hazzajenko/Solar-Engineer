﻿using FastEndpoints;
using Identity.Application.Services.Connections;

namespace Identity.API.Endpoints.Connections;

public class AllConnectedUsersResponse
{
    public IEnumerable<Guid> ConnectedUsers { get; set; } = new List<Guid>();
    public int Count => ConnectedUsers.Count();
}

public class ConnectionsEndpoint : EndpointWithoutRequest<AllConnectedUsersResponse>
{
    private readonly IConnectionsService _connections;

    public ConnectionsEndpoint(IConnectionsService connections)
    {
        _connections = connections;
    }

    public override void Configure()
    {
        Get("/connections");
        AllowAnonymous();
        Summary(x =>
        {
            x.Summary = "Get all connected users";
            x.Description = "Get all connected users";
            x.Response<AllConnectedUsersResponse>(200, "Success");
            x.Response(401, "Unauthorized");
        });
        Throttle(hitLimit: 20, durationSeconds: 60);
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        Response.ConnectedUsers = _connections.GetAllConnectedUserIds();
        await SendOkAsync(Response, cT);
    }
}
