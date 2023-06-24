using ApplicationCore.Extensions;
using FastEndpoints;
using Infrastructure.Extensions;
using Mediator;
using Projects.Contracts.Responses;
using Projects.SignalR.Queries.Projects;

namespace Projects.API.Endpoints;

public class GetUserProjectsEndpoint : EndpointWithoutRequest<GetUserProjectsResponse>
{
    private readonly IMediator _mediator;

    public GetUserProjectsEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("/projects");
        Summary(x =>
        {
            x.Summary = "Get all projects for a user";
            x.Description = "Get all projects for a user";
            x.Response<GetUserProjectsResponse>(200, "Success");
            x.Response(401, "Unauthorized");
        });
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        Response.Projects = await _mediator.Send(
            new GetUserProjectsQuery(User.ClaimsToAuthUser()),
            cT
        );

        await SendOkAsync(Response, cT);
    }
}