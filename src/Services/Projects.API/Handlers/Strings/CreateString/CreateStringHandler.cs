using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Data;
using Projects.API.Hubs;
using Projects.API.Mapping;

namespace Projects.API.Handlers.Strings.CreateString;

/*public sealed record CreateStringCommand(
    HubCallerContext Context,
    CreateStringRequest CreateStringRequest
) : IRequest<bool>;*/

public class CreateStringHandler : ICommandHandler<CreateStringCommand, bool>
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

    public async ValueTask<bool> Handle(CreateStringCommand command, CancellationToken cT)
    {
        var appUserId = command.User.GetGuidUserId();
        var projectId = command.CreateString.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );

        var @string = String.Create(command.CreateString, projectId, appUserId);

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