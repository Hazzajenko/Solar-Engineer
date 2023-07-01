using ApplicationCore.Extensions;
using FastEndpoints;
using Infrastructure.Extensions;
using Mediator;
using Projects.Application.Data.Json.ProjectTemplates;
using Projects.Contracts.Responses;
using Projects.SignalR.Queries.Projects;

namespace Projects.API.Endpoints;

public class GetProjectTemplateEndpoint : EndpointWithoutRequest<ProjectTemplate>
{
    private readonly IMediator _mediator;

    public GetProjectTemplateEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("/template");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        ProjectTemplateKey templateKey = ProjectTemplateKey.TwelveRowsNoStrings;

        Response = await templateKey.GetProjectTemplateByKey();

        await SendOkAsync(Response, cT);
    }
}
