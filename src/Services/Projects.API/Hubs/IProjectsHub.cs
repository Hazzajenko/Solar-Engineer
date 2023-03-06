using Projects.API.Contracts.Data;
using Projects.API.Contracts.Requests.Projects;

namespace Projects.API.Hubs;

public interface IProjectsHub
{
    Task GetProjects(IEnumerable<ProjectDto> projects);
    Task GetUserProject(ProjectDto project);
    Task GetProjectData(ProjectDataDto projectData);

    Task UpdateProject(ProjectChanges projectChanges);

    Task PanelsCreated(IEnumerable<PanelDto> panels);
    Task PanelsUpdated(IEnumerable<PanelDto> panels);

    Task StringsCreated(IEnumerable<StringDto> strings);
    // Task UserIsOnline(IEnumerable<ConnectionDto> connections);
    // Task UserIsOffline(IEnumerable<ConnectionDto> connections);
    // Task GetOnlineUsers(IEnumerable<ConnectionDto> connections);
}