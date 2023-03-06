using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Requests.Strings;
using Projects.API.Data;
using Projects.API.Hubs;
using Projects.API.Mapping;

namespace Projects.API.Handlers.SignalR.Strings;

public sealed record CreateStringCommand(
    HubCallerContext Context,
    CreateStringRequest CreateStringRequest
) : IRequest<bool>;

public class CreateStringHandler : IRequestHandler<CreateStringCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<CreateStringHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public CreateStringHandler(
        ILogger<CreateStringHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(CreateStringCommand request, CancellationToken cT)
    {
        var user = ThrowHubExceptionIfNull(request.Context.User, "User is null");
        var appUserId = user.GetGuidUserId();
        var projectId = request.CreateStringRequest.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );

        var @string = String.Create(request.CreateStringRequest, projectId, appUserId);

        await _unitOfWork.StringsRepository.AddAsync(@string);
        await _unitOfWork.SaveChangesAsync();

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .StringsCreated(@string.ToDtoList());
        await _hubContext.Clients.Users(projectMembers).StringsCreated(@string.ToDtoList());

        _logger.LogInformation(
            "User {User} created string {String} in project {Project}",
            appUserId.ToString(),
            @string.Id.ToString(),
            appUserProject.Project.Id
        );

        return true;
    }
}