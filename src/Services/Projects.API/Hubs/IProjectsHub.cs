using Projects.API.Contracts.Data;
using Projects.API.Contracts.Requests;

namespace Projects.API.Hubs;

public interface IProjectsHub
{
    Task GetUserProject(ProjectDto project);
    Task UpdateProject(ProjectChanges projectChanges);
    // Task UserIsOnline(IEnumerable<ConnectionDto> connections);
    // Task UserIsOffline(IEnumerable<ConnectionDto> connections);
    // Task GetOnlineUsers(IEnumerable<ConnectionDto> connections);
}