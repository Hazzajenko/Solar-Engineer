﻿using Projects.API.Contracts.Data;
using Projects.API.Contracts.Requests.Projects;
using Projects.API.Contracts.Responses;

namespace Projects.API.Hubs;

public interface IProjectsHub
{
    Task GetManyProjects(IEnumerable<ProjectDto> projects);
    Task GetUserProject(ProjectDto project);
    Task GetProject(ProjectDataDto projectData);
    Task NewProject(ProjectDto project);
    Task UpdateProject(ProjectDto project);
    Task DeleteProject();
    Task InvitedToProject(ProjectDto project);

    Task UpdateProject(ProjectChanges projectChanges);

    Task PanelsCreated(IEnumerable<PanelCreatedResponse> panels);
    Task NewProjectEvents(IEnumerable<ProjectEventResponse> projectEvents);
    Task ReceiveProjectEvents(IEnumerable<ProjectEventResponse> projectEvents);
    Task ReceiveProjectEvent(ProjectEventResponse projectEvent);

    // Task PanelsCreated(IEnumerable<PanelDto> panels);
    Task PanelsUpdated(IEnumerable<PanelDto> panels);

    Task StringsCreated(IEnumerable<StringDto> strings);
    // Task UserIsOnline(IEnumerable<ConnectionDto> connections);
    // Task UserIsOffline(IEnumerable<ConnectionDto> connections);
    // Task GetOnlineUsers(IEnumerable<ConnectionDto> connections);
}