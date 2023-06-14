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
    Task UserAcceptedInviteToProject(AcceptInviteToProjectResponse response);
    Task UserRejectedInviteToProject(RejectInviteToProjectResponse response);
    Task ProjectDeleted(DeleteProjectResponse response);
    Task InvitedToProject(InvitedToProjectResponse response);

    Task ProjectUpdated(UpdateProjectResponse response);

    // Task UpdateProject(ProjectChanges projectChanges);

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
