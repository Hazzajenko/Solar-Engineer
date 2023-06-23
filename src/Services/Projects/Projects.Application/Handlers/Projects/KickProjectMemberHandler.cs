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
                "{User}  tried to kick member from project {Project} without a App User Project Link",
                command.User.GetLoggingString(),
                projectId
            );
            var message = "You are not a member of this project";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        if (appUserProject.Role.EqualsOneOf("Owner", "Admin") is false)
        {
            _logger.LogError(
                "{User} tried to kick member from {Project} without permission",
                command.User.GetLoggingString(),
                appUserProject.Project.GetProjectLoggingString()
            );
            var message = "You do not have permission to delete this project";
            throw new ValidationException(message, message.ToValidationFailure<AppUserProject>());
        }

        var recipientId = command.Request.MemberId.ToGuid();
        var memberToKick =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                recipientId,
                projectId
            );

        if (memberToKick is null)
        {
            _logger.LogError(
                "{User} tried to kick member {Member} from {Project} without a App User Project Link",
                command.User.GetLoggingString(),
                recipientId,
                appUserProject.Project.GetProjectLoggingString()
            );
            var message = "Member doesnt exist";
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
            "{User} kicked Member {Member} from project {Project}",
            command.User.GetLoggingString(),
            command.Request.MemberId,
            appUserProject.Project.GetProjectLoggingString()
        );

        return true;
    }
}
