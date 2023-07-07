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

public class KickProjectMemberHandler : ICommandHandler<KickProjectMemberCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<KickProjectMemberHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public KickProjectMemberHandler(
        ILogger<KickProjectMemberHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(KickProjectMemberCommand command, CancellationToken cT)
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
                "User {UserName}: Tried to kick member from Project {ProjectId} without a App User Project",
                command.User.UserName,
                projectId
            );
            const string message = "You are not a member of this project";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        if (appUserProject.Role.EqualsOneOf("Owner", "Admin") is false)
        {
            _logger.LogError(
                "User {UserName}: Tried to kick member from project {ProjectName} without permissions. User role: {UserRole}",
                command.User.UserName,
                appUserProject.Project.Name,
                appUserProject.Role
            );
            const string message = "You do not have permission to delete this project";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        var recipientId = command.Request.MemberId.ToGuid();
        AppUserProject? memberToKick =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                recipientId,
                projectId
            );

        if (memberToKick is null)
        {
            _logger.LogError(
                "User {UserName}: Tried to kick member {MemberId} from Project {ProjectName} without a App User Project",
                command.User.UserName,
                recipientId,
                appUserProject.Project.Name
            );
            const string message = "Member does not exist";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        await _unitOfWork.AppUserProjectsRepository.ExecuteDeleteAsync(
            x => x.AppUserId == command.Request.MemberId.ToGuid() && x.ProjectId == projectId
        );

        await _unitOfWork.SaveChangesAsync();

        var kickedFromProjectResponse = new KickedFromProjectResponse
        {
            ProjectId = appUserProject.ProjectId.ToString(),
        };

        await _hubContext.Clients
            .Users(command.Request.MemberId)
            .KickedFromProject(kickedFromProjectResponse);

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(projectId);
        var projectMembersExceptKickedUser = projectMembers.Where(x => x != recipientId.ToString());

        var memberKickedResponse = new ProjectMemberKickedResponse
        {
            ProjectId = projectId.ToString(),
            MemberId = command.Request.MemberId
        };
        await _hubContext.Clients
            .Users(projectMembersExceptKickedUser)
            .ProjectMemberKicked(memberKickedResponse);
        _logger.LogInformation(
            "User {UserName}: Kicked member {MemberId} from Project {ProjectName}",
            command.User.UserName,
            command.Request.MemberId,
            appUserProject.Project.Name
        );

        return true;
    }
}
