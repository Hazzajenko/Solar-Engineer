using Projects.Contracts.Data;
using Projects.Contracts.Responses;
using Projects.Contracts.Responses.Projects;

namespace Projects.SignalR.Hubs;

public interface IProjectsHub
{
    Task GetManyProjects(GetManyProjectsResponse response);
    Task GetUserProject(ProjectDto project);
    Task GetProject(GetProjectDataResponse response);

    Task ProjectCreated(ProjectCreatedResponse response);

    // Task UpdateProject(ProjectDto project);
    // Task ProjectUpdated(ProjectDto project);
    Task UsersSentInviteToProject(UsersSentInviteToProjectResponse response);
    Task UserAcceptedInviteToProject(UserAcceptedInviteToProjectResponse response);
    Task UserRejectedInviteToProject(UserRejectedInviteToProjectResponse response);
    Task UserLeftProject(UserLeftProjectResponse response);
    Task LeftProject(LeftProjectResponse response);
    Task ProjectDeleted(ProjectDeletedResponse deletedResponse);
    Task InvitedToProject(InvitedToProjectResponse response);

    Task ProjectUpdated(ProjectUpdatedResponse updatedResponse);

    // Task UpdateProject(ProjectChanges projectChanges);

    Task PanelsCreated(IEnumerable<PanelCreatedResponse> panels);
    Task NewProjectEvents(IEnumerable<ProjectEventResponse> projectEvents);
    Task ReceiveProjectEvents(IEnumerable<ProjectEventResponse> projectEvents);
    Task ReceiveProjectEvent(ProjectEventResponse projectEvent);
    Task ReceiveCombinedProjectEvent(CombinedProjectEventResponse projectEvent);

    // Task PanelsCreated(IEnumerable<PanelDto> panels);
    Task PanelsUpdated(IEnumerable<PanelDto> panels);

    Task StringsCreated(IEnumerable<StringDto> strings);
    // Task UserIsOnline(IEnumerable<ConnectionDto> connections);
    // Task UserIsOffline(IEnumerable<ConnectionDto> connections);
    // Task GetOnlineUsers(IEnumerable<ConnectionDto> connections);
}
