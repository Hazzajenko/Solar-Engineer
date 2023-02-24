using Infrastructure.Repositories;
using Projects.API.Data;
using Projects.API.Entities;

// using AppUser = Users.API.Entities.AppUser;

namespace Projects.API.Repositories.Projects;

public sealed class ProjectsRepository : GenericRepository<ProjectsContext, Project>,
    IProjectsRepository
{
    public ProjectsRepository(ProjectsContext context) : base(context)
    {
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