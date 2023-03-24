using Infrastructure.Repositories;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.Projects;

public interface IProjectsRepository : IGenericRepository<Project>
{
    // Task<IEnumerable<string>> GetGroupChatMemberIdsAsync(Guid groupChatId, Guid? userId = null);
    // Task<IEnumerable<GroupChatDto>> GetLatestGroupChatMessagesAsync(Guid appUserId);
    // Task<AppUserGroupChat?> GetByAppUserAndGroupChatIdAsync(Guid appUserId, Guid groupChatId);
}