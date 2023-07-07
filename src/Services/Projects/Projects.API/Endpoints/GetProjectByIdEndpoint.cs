using ApplicationCore.Extensions;
using FastEndpoints;
using Infrastructure.Extensions;
using Mediator;
using Projects.Contracts.Requests.Projects;
using Projects.Contracts.Responses;
using Projects.Contracts.Responses.Projects;
using Projects.SignalR.Queries.Projects;
using Serilog;

namespace Projects.API.Endpoints;

public class GetProjectByIdEndpoint : Endpoint<GetProjectByIdRequest, GetProjectByIdResponse>
{
    private readonly IMediator _mediator;

    public GetProjectByIdEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("/projects/{@projectId}", x => new { Id = x.ProjectId });
        Summary(x =>
        {
            x.Summary = "Get a project by id";
            x.Description = "Get a project by id";
            x.Response<GetProjectByIdResponse>(200, "Success");
            x.Response(401, "Unauthorized");
        });
    }

    public override async Task HandleAsync(GetProjectByIdRequest request, CancellationToken cT)
    {
        var authUser = User.ToAuthUser();
        Response = await _mediator.Send(new GetProjectByIdQuery(authUser, request.ProjectId), cT);

        Logger.LogInformation(
            "User {UserName}: Get Project by Id {ProjectId}",
            authUser.UserName,
            request.ProjectId
        );

        await SendOkAsync(Response, cT);
    }
}
