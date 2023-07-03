using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using Infrastructure.Logging;
using Mapster;
using MassTransit;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.Json.ProjectTemplates;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Contracts.Data;
using Projects.Contracts.Events;
using Projects.Contracts.Requests.Projects;
using Projects.Contracts.Responses.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Projects;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class CreateProjectHandler
    : ICommandHandler<CreateProjectCommand, ProjectCreatedWithTemplateResponse>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<CreateProjectHandler> _logger;
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

    public async ValueTask<ProjectCreatedWithTemplateResponse> Handle(
        CreateProjectCommand command,
        CancellationToken cT
    )
    {
        Guid appUserId = command.User.Id;

        CreateProjectRequest request = command.CreateProjectRequest;

        var appUserProject = AppUserProject.CreateAsOwner(appUserId, request.Name, request.Colour);
        await _unitOfWork.AppUserProjectsRepository.AddAsync(appUserProject);
        await _unitOfWork.SaveChangesAsync();

        appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                appUserProject.ProjectId
            );

        appUserProject.ThrowHubExceptionIfNull();
        Project project = appUserProject.Project;

        var undefinedString = String.CreateUndefinedStringFromProject(appUserProject);
        await _unitOfWork.StringsRepository.AddAsync(undefinedString);
        await _unitOfWork.SaveChangesAsync();

        // var projectDto = appUserProject.Adapt<ProjectDto>();
        var defaultPanelConfigs =
            await _unitOfWork.PanelConfigsRepository.GetDefaultPanelConfigsAsync();
        ProjectDataDto dataDto = await GetProjectDataDto(
            request,
            undefinedString,
            project,
            appUserId,
            defaultPanelConfigs
        );

        var projectCreatedResponse = new ProjectCreatedWithTemplateResponse() { Project = dataDto };

        // ! Changing to http
        // await _hubContext.Clients.User(appUserId.ToString()).ProjectCreated(projectCreatedResponse);



        _logger.LogInformation(
            "User {User} created project {Project}",
            appUserId,
            appUserProject.Project.Name
        );

        if (command.CreateProjectRequest.MemberIds.Any() is false)
        {
            return projectCreatedResponse;
            // return project.Id;
        }

        var userIds = command.CreateProjectRequest.MemberIds;
        Guid projectId = project.Id;
        // var projectMemberIds =
        //     await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(projectId);
        //
        // var newProjectMembers = new UsersSentInviteToProjectResponse
        // {
        //     ProjectId = projectId.ToString(),
        //     InvitedByUserId = appUserId.ToString(),
        //     InvitedUserIds = userIds
        // };
        //
        // await _hubContext.Clients
        //     .Users(projectMemberIds)
        //     .UsersSentInviteToProject(newProjectMembers);

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

        return projectCreatedResponse;
        // return appUserProject.Project.Id;
    }

    private async Task<ProjectDataDto> GetProjectDataDto(
        CreateProjectRequest request,
        String undefinedString,
        Project project,
        Guid appUserId,
        IEnumerable<PanelConfig> defaultPanelConfigs
    )
    {
        if (request.TemplateType == ProjectTemplateKey.Blank)
        {
            return project.ToDefaultEmptyDataDto(undefinedString, defaultPanelConfigs);
        }

        ProjectTemplate projectTemplate = await request.TemplateType.GetProjectTemplateByKey();
        var panelsWithUndefinedString = projectTemplate.Panels
            .Where(panel => panel.StringId == String.UndefinedStringId)
            .ToList();

        panelsWithUndefinedString.ForEach(panel => panel.StringId = undefinedString.Id.ToString());

        var panelsWithDefaultConfigs = projectTemplate.Panels
            .Where(panel => panel.PanelConfigId == PanelConfig.DefaultPanelConfigId)
            .ToList();

        panelsWithDefaultConfigs.ForEach(
            panel => panel.PanelConfigId = defaultPanelConfigs.First().Id.ToString()
        );

        var panels = projectTemplate.Panels.ToEntityList(project.Id, appUserId);
        var strings = projectTemplate.Strings
            .Where(x => x.Id != String.UndefinedStringId)
            .ToEntityList(project.Id, appUserId);
        var panelLinks = projectTemplate.PanelLinks.Adapt<IEnumerable<PanelLink>>();
        // var panelConfigs = projectTemplate.PanelConfigs
        //     .Where(x => x.Id != PanelConfig.DefaultPanelConfigId)
        //     .Adapt<IEnumerable<PanelConfig>>()
        //     .Concat(defaultPanelConfigs);
        // await _unitOfWork.PanelConfigsRepository.AddRangeAsync(panelConfigs);
        // await _unitOfWork.SaveChangesAsync();

        await _unitOfWork.StringsRepository.AddRangeAsync(strings);
        await _unitOfWork.SaveChangesAsync();

        await _unitOfWork.PanelsRepository.AddRangeAsync(panels);
        await _unitOfWork.SaveChangesAsync();

        await _unitOfWork.PanelLinksRepository.AddRangeAsync(panelLinks);
        await _unitOfWork.SaveChangesAsync();

        return project.ToDataDto(
            panels,
            strings.Concat(new[] { undefinedString }),
            panelLinks,
            defaultPanelConfigs
        );
    }
}
