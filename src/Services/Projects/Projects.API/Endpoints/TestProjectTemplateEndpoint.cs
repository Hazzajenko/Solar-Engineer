using ApplicationCore.Extensions;
using FastEndpoints;
using Infrastructure.Extensions;
using Infrastructure.Logging;
using Mediator;
using Projects.Application.Data.Json.ProjectTemplates;
using Projects.Contracts.Data;
using Projects.Contracts.Responses;
using Projects.Domain.Common;
using Projects.SignalR.Queries.Projects;

namespace Projects.API.Endpoints;

public class TestProjectTemplateEndpoint : Endpoint<ProjectTemplateKey, ProjectTemplateKey>
{
    private readonly IMediator _mediator;

    public TestProjectTemplateEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Post("/template");
        AllowAnonymous();
    }

    public override async Task HandleAsync(ProjectTemplateKey request, CancellationToken cT)
    {
        request.DumpObjectJson();

        await SendOkAsync(request, cT);
    }
}
