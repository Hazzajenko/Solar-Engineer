using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using Mapster;
using MassTransit;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Contracts.Data;
using Projects.Contracts.Events;
using Projects.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Projects;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class CreateProjectHandler : ICommandHandler<CreateProjectCommand, Guid>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;
    private readonly IBus _bus;

    public CreateProjectHandler(
        ILogger<CreateProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext,
        IBus bus
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _bus = bus;
    }

    public async ValueTask<Guid> Handle(CreateProjectCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;

        var request = command.CreateProjectRequest;
        var appUserProject = AppUserProject.CreateAsOwner(appUserId, request.Name, request.Colour);
        await _unitOfWork.AppUserProjectsRepository.AddAsync(appUserProject);
        await _unitOfWork.SaveChangesAsync();

        appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                appUserProject.ProjectId
            );

        appUserProject.ThrowHubExceptionIfNull();
        var project = appUserProject.Project;

        String undefinedString = String.CreateUndefinedStringFromProject(appUserProject);
        await _unitOfWork.StringsRepository.AddAsync(undefinedString);
        await _unitOfWork.SaveChangesAsync();

        var projectDto = appUserProject.Adapt<ProjectDto>();
        // var projectDto = appUserProject.Project.ToDto();
        var projectCreatedResponse = new ProjectCreatedResponse { Project = projectDto };

        await _hubContext.Clients.User(appUserId.ToString()).ProjectCreated(projectCreatedResponse);

        _logger.LogInformation(
            "User {User} created project {Project}",
            appUserId,
            appUserProject.Project.Name
        );

        if (command.CreateProjectRequest.MemberIds.Any() is false)
        {
            return project.Id;
        }

        var userIds = command.CreateProjectRequest.MemberIds;
        var projectId = project.Id;
        var projectMemberIds =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(projectId);

        var newProjectMembers = new UsersSentInviteToProjectResponse
        {
            ProjectId = projectId.ToString(),
            InvitedByUserId = appUserId.ToString(),
            InvitedUserIds = userIds
        };

        // var projectDto = appUserProject.Project.ToDto();

        // var invitedToProjectResponse = new InvitedToProjectResponse
        // {
        //     Project = projectDto
        // };

        // await _hubContext.Clients.Users(userIds).InvitedToProject(invitedToProjectResponse);
        await _hubContext.Clients
            .Users(projectMemberIds)
            .UsersSentInviteToProject(newProjectMembers);

        _logger.LogInformation(
            "User {User} invited users {Users} to project {Project}",
            appUserId,
            userIds,
            appUserProject.Project.Name
        );

        var projectName = project.Name;
        // TODO get project photo url
        var projectPhotoUrl = "";

        var invitedUsersToProjectMessage = new InvitedUsersToProject(
            Guid.NewGuid(),
            appUserId,
            projectId,
            projectName,
            projectPhotoUrl,
            userIds
        );
        await _bus.Publish(invitedUsersToProjectMessage, cT);

        return appUserProject.Project.Id;
    }
}
