using ApplicationCore.Extensions;
using FastEndpoints;
using Infrastructure.Extensions;
using Infrastructure.Logging;
using Mediator;
using Projects.Contracts.Requests.Projects;
using Projects.Contracts.Responses.Projects;
using Projects.SignalR.Commands.Projects;

namespace Projects.API.Endpoints;

public class CreateProjectEndpoint
    : Endpoint<CreateProjectRequest, ProjectCreatedWithTemplateResponse>
{
    private readonly IMediator _mediator;

    public CreateProjectEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("/projects");
        Summary(x =>
        {
            x.Summary = "Create a new project";
            x.Description = "Create a new project";
            x.Response(201, "Created");
            x.Response(401, "Unauthorized");
        });
    }

    public override async Task HandleAsync(CreateProjectRequest request, CancellationToken cT)
    {

        Response = await _mediator.Send(
            new CreateProjectCommand(User.ClaimsToAuthUser(), request),
            cT
        );
        await SendOkAsync(Response, cT);
    }
}
