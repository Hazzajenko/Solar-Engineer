using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Domain.Common;
using Projects.SignalR.Commands.Strings;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Strings;

public class UpdateStringHandler : ICommandHandler<UpdateStringCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<UpdateStringHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public UpdateStringHandler(
        ILogger<UpdateStringHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(UpdateStringCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        var projectId = command.Request.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var stringId = command.Request.Update.Id.ToGuid();

        var @string = await _unitOfWork.StringsRepository.GetByIdAndProjectIdAsync(
            stringId,
            projectId
        );
        @string.ThrowExceptionIfNull(new HubException("String not found"));

        var changes = command.Request.Update.Changes;

        _unitOfWork.Attach(@string);
        if (changes.Name is not null)
            @string.Name = changes.Name;

        if (changes.Colour is not null)
            @string.Colour = changes.Colour;

        if (changes.Parallel is not null)
            @string.Parallel = (bool)changes.Parallel;

        await _unitOfWork.StringsRepository.UpdateAsync(@string);
        await _unitOfWork.SaveChangesAsync();

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        var response = @string.ToProjectEventResponseFromEntity(command, ActionType.Update);
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} updated panel {String} in project {Project}",
            appUserId.ToString(),
            @string.Id.ToString(),
            appUserProject.Project.Name
        );

        return true;
    }
}