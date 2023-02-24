using Infrastructure.Repositories;
using Projects.API.Contracts.Data;
using Projects.API.Entities;

namespace Projects.API.Repositories.AppUserProjects;

public interface IAppUserProjectsRepository : IGenericRepository<AppUserProject>
{
    Task<IEnumerable<AppUserProject>> GetByAppUserId(Guid appUserId);

    Task<IEnumerable<ProjectDto>> GetProjectsByAppUserId(Guid appUserId);

    Task<AppUserProject?> GetByAppUserAndProjectId(Guid appUserId, Guid projectId);
    // Task<IEnumerable<string>> GetGroupChatMemberIdsAsync(Guid groupChatId, Guid? userId = null);
    // Task<IEnumerable<GroupChatDto>> GetLatestGroupChatMessagesAsync(Guid appUserId);
    // Task<AppUserGroupChat?> GetByAppUserAndGroupChatIdAsync(Guid appUserId, Guid groupChatId);
}