using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data;
using Projects.Application.Mapping;
using Projects.Domain.Commands.Strings;
using Projects.Domain.Contracts.Data;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Strings;

public class DeleteStringHandler : ICommandHandler<DeleteStringCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<DeleteStringHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public DeleteStringHandler(
        ILogger<DeleteStringHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(DeleteStringCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        var projectId = command.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var stringId = command.Request.Id.ToGuid();

        var deleteResult = await _unitOfWork.StringsRepository.DeleteStringByIdAndProjectIdAsync(
            stringId,
            projectId
        );
        if (!deleteResult)
            throw new HubException("String not found");

        var stringIdString = stringId.ToString();

        var response = stringIdString.ToProjectEventResponseFromId<String>(
            command,
            ActionType.Delete
        );

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} deleted string {String} in project {Project}",
            appUserId.ToString(),
            stringIdString,
            projectId.ToString()
        );

        return true;
    }
}