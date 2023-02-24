using Infrastructure.Repositories;
using Projects.API.Entities;

namespace Projects.API.Repositories.Projects;

public interface IProjectsRepository : IGenericRepository<Project>
{
    // Task<IEnumerable<string>> GetGroupChatMemberIdsAsync(Guid groupChatId, Guid? userId = null);
    // Task<IEnumerable<GroupChatDto>> GetLatestGroupChatMessagesAsync(Guid appUserId);
    // Task<AppUserGroupChat?> GetByAppUserAndGroupChatIdAsync(Guid appUserId, Guid groupChatId);
}