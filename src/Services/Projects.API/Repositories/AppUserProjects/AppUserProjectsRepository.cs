using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Entities;
using Projects.API.Mapping;

// using AppUser = Users.API.Entities.AppUser;

namespace Projects.API.Repositories.AppUserProjects;

public sealed class AppUserProjectsRepository : GenericRepository<ProjectsContext, AppUserProject>,
    IAppUserProjectsRepository
{
    public AppUserProjectsRepository(ProjectsContext context) : base(context)
    {
    }

    public async Task<IEnumerable<AppUserProject>> GetByAppUserIdAsync(Guid appUserId)
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId)
            .ToListAsync();
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsByAppUserIdAsync(Guid appUserId)
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId)
            .Include(x => x.Project)
            .Select(x => x.ToDto())
            .ToListAsync();
    }

    public async Task<AppUserProject?> GetByAppUserAndProjectIdAsync(Guid appUserId, Guid projectId)
    {
        return await Queryable
            .Include(x => x.Project)
            .SingleOrDefaultAsync(x => x.AppUserId == appUserId && x.ProjectId == projectId);
    }

    public async Task<ProjectDto?> GetProjectByAppUserAndProjectIdAsync(Guid appUserId, Guid projectId)
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId && x.ProjectId == projectId)
            .Include(x => x.Project)
            .Select(x => x.ToDto())
            .SingleOrDefaultAsync(); 
    }

    public async Task<IEnumerable<string>> GetProjectMemberIdsByProjectId(Guid projectId)
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId)
            .Select(x => x.AppUserId.ToString())
            .ToArrayAsync();
    }

    /*public async Task<IEnumerable<string>> GetGroupChatMemberIdsAsync(Guid groupChatId, Guid? userId = null)
    {
        return await Queryable
            .Where(x => x.GroupChatId == groupChatId)
            .Select(x => x.AppUserId.ToString())
            .Where(x => userId == null || x != userId.ToString())
            .ToArrayAsync();
    }

    public async Task<IEnumerable<GroupChatDto>> GetLatestGroupChatMessagesAsync(Guid appUserId)
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId)
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.CreatedBy)
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.GroupChatMessages)
            .ThenInclude(x => x.MessageReadTimes)
            .AsSplitQuery()
            .Include(x => x.GroupChat)
            .ThenInclude(x => x.UserGroupChats)
            .AsSplitQuery()
            .Select(x => new GroupChatDto
            {
                Id = x.GroupChat.Id.ToString(),
                Name = x.GroupChat.Name,
                PhotoUrl = x.GroupChat.PhotoUrl,
                Members = x.GroupChat.UserGroupChats
                    .OrderBy(c => c.CreatedTime)
                    .Select(c => c.ToInitialMemberDto()),
                LatestMessage = x.GroupChat.GroupChatMessages
                    .OrderBy(o => o.MessageSentTime)
                    .Select(y => y.ToCombinedDto(appUserId))
                    .LastOrDefault()
            }).ToListAsync();
    }

    public async Task<AppUserGroupChat?> GetByAppUserAndGroupChatIdAsync(Guid appUserId, Guid groupChatId)
    {
        return await Queryable
            .SingleOrDefaultAsync(x => x.AppUserId == appUserId && x.GroupChatId == groupChatId);
    }*/
}