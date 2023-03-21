using FastEndpoints;
using Infrastructure.Extensions;
using Mapster;
using Mediator;
using Projects.API.Contracts.Data;
using Projects.API.Contracts.Requests.Admin;
using Projects.API.Contracts.Responses.Admin;
using Projects.API.Data.Bogus;
using Projects.API.Repositories.AppUserProjects;

namespace Projects.API.Endpoints.Admin;

public class GenerateProjectMembersEndpoint
    : Endpoint<GenerateProjectMembersRequest, GenerateProjectMembersResponse>
{
    private readonly IAppUserProjectsRepository _appUserProjectsRepository;
    private readonly IMediator _mediator;

    public GenerateProjectMembersEndpoint(
        IMediator mediator,
        IAppUserProjectsRepository appUserProjectsRepository
    )
    {
        _mediator = mediator;
        _appUserProjectsRepository = appUserProjectsRepository;
    }

    public override void Configure()
    {
        Post("/admin/projects/generate/members");
        AllowAnonymous();
    }

    public override async Task HandleAsync(
        GenerateProjectMembersRequest request,
        CancellationToken cT
    )
    {
        var appUserProjects = BogusGenerators
            .GetAppUserProjectGenerator(request.ProjectId.ToGuid())
            .Generate(request.NumberOfMembers);
        // await _mediator.Send(new CreateProjectCommand(User, request), cT);
        var result = await _appUserProjectsRepository.AddManyAndSaveChangesAsync(appUserProjects);
        Response.AppUserProjects = result.Adapt<IEnumerable<AppUserProjectDto>>();
        // appUserProjects.ToDtoIEnumerable<AppUserProject, AppUserProjectDto>();
        await SendOkAsync(Response, cT);
    }
}