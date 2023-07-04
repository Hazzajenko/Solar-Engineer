using ApplicationCore.Extensions;
using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Mapping;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Extensions;
using Projects.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Projects;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class UpdateProjectMemberHandler : ICommandHandler<UpdateProjectMemberCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<UpdateProjectMemberHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public UpdateProjectMemberHandler(
        ILogger<UpdateProjectMemberHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(UpdateProjectMemberCommand command, CancellationToken cT)
    {
        ArgumentNullException.ThrowIfNull(command.User);
        var appUserId = command.User.Id;
        var projectId = command.Request.ProjectId.ToGuid();

        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        if (appUserProject is null)
        {
            _logger.LogError(
                "User {User} tried to update project {Project} without a App User Project Link",
                command.User.ToAuthUserLog(),
                projectId
            );
            var message = $"User {appUserId} is not apart of project {projectId}";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        if (appUserProject.Role.EqualsOneOf("Owner", "Admin") is false)
        {
            _logger.LogError(
                "User {User} tried to update project {Project} without permission",
                command.User.ToAuthUserLog(),
                projectId
            );
            var message =
                $"User {appUserId} does not have permission to update project {projectId}";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }
        var request = command.Request;
        var recipientUserId = request.MemberId.ToGuid();

        var recipientAppUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                recipientUserId,
                projectId
            );

        if (recipientAppUserProject is null)
        {
            _logger.LogError(
                "User {User} tried to update project {Project} for user {Recipient} without a App User Project Link",
                command.User.ToAuthUserLog(),
                projectId,
                recipientUserId
            );
            var message = $"User {request.MemberId} is not apart of project {projectId}";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        var changesResp = new Dictionary<string, object>();
        var changes = request.Changes;

        if (changes.Role is not null)
        {
            if (changes.Role.EqualsOneOf("Owner", "Admin", "Member") is false)
            {
                _logger.LogError(
                    "User {User} tried to update project {Project} with invalid role {Role}",
                    command.User.ToAuthUserLog(),
                    projectId,
                    changes.Role
                );
                var message = $"Role {changes.Role} is not valid";
                throw new ValidationException(
                    message,
                    message.ToValidationFailure<AppUserProject>()
                );
            }
            recipientAppUserProject.Role = changes.Role;
            changesResp.Add(nameof(AppUserProject.Role).ToCamelCase(), changes.Role);
        }

        if (changes.CanCreate is not null)
        {
            recipientAppUserProject.CanCreate = changes.CanCreate.Value;
            changesResp.Add(
                nameof(AppUserProject.CanCreate).ToCamelCase(),
                changes.CanCreate.Value
            );
        }

        if (changes.CanInvite is not null)
        {
            recipientAppUserProject.CanInvite = changes.CanInvite.Value;
            changesResp.Add(
                nameof(AppUserProject.CanInvite).ToCamelCase(),
                changes.CanInvite.Value
            );
        }

        if (changes.CanDelete is not null)
        {
            recipientAppUserProject.CanDelete = changes.CanDelete.Value;
            changesResp.Add(
                nameof(AppUserProject.CanDelete).ToCamelCase(),
                changes.CanDelete.Value
            );
        }
        if (changes.CanKick is not null)
        {
            recipientAppUserProject.CanKick = changes.CanKick.Value;
            changesResp.Add(nameof(AppUserProject.CanKick).ToCamelCase(), changes.CanKick.Value);
        }

        await _unitOfWork.AppUserProjectsRepository.UpdateAsync(recipientAppUserProject);
        await _unitOfWork.SaveChangesAsync();

        var projectMemberIds =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(projectId);

        var projectMemberUpdatedResponse = new ProjectMemberUpdatedResponse
        {
            ProjectId = projectId.ToString(),
            MemberId = recipientUserId.ToString(),
            Changes = changesResp
        };

        await _hubContext.Clients
            .Users(projectMemberIds)
            .ProjectMemberUpdated(projectMemberUpdatedResponse);

        _logger.LogInformation(
            "{User} updated a Project Member in {Project}",
            command.User.ToAuthUserLog(),
            appUserProject.Project.GetProjectLoggingString()
        );

        return true;
    }
}
