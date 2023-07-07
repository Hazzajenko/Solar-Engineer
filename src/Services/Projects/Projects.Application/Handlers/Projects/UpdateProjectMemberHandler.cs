using ApplicationCore.Extensions;
using FluentValidation;
using Infrastructure.Extensions;
using Infrastructure.Mapping;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Extensions;
using Projects.Contracts.Requests.Projects;
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
        Guid appUserId = command.User.Id;
        var projectId = command.Request.ProjectId.ToGuid();

        AppUserProject? appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        if (appUserProject is null)
        {
            _logger.LogError(
                "User {UserName}: Tried to update Project {ProjectId} without a App User Project",
                command.User.UserName,
                projectId
            );
            const string message = "You are not a member of this project";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        if (appUserProject.Role.EqualsOneOf("Owner", "Admin") is false)
        {
            _logger.LogError(
                "User {UserName}: Tried to update Project {ProjectName} without permissions. User role: {UserRole}",
                command.User.UserName,
                appUserProject.Project.Name,
                appUserProject.Role
            );
            const string message = "You do not have permission to update this project";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }
        UpdateProjectMemberRequest request = command.Request;
        var recipientUserId = request.MemberId.ToGuid();

        AppUserProject? recipientAppUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                recipientUserId,
                projectId
            );

        if (recipientAppUserProject is null)
        {
            _logger.LogError(
                "User {UserName}: Tried to update Project {ProjectName} for User {RecipientId} without a App User Project",
                command.User.UserName,
                appUserProject.Project.Name,
                recipientUserId
            );
            const string message = "User is not a member of this project";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        var changesResp = new Dictionary<string, object>();
        ProjectMemberChanges changes = request.Changes;

        if (changes.Role is not null)
        {
            if (changes.Role.EqualsOneOf("Owner", "Admin", "Member") is false)
            {
                _logger.LogError(
                    "User {UserName}: Tried to update Project {ProjectName} with invalid role {Role}",
                    command.User.UserName,
                    appUserProject.Project.Name,
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
            "User {UserName}: Updated a Project Member in Project {ProjectName}",
            command.User.UserName,
            appUserProject.Project.Name
        );

        return true;
    }
}
