using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Entities;
using Projects.API.Mapping;

// using AppUser = Users.API.Entities.AppUser;

namespace Projects.API.Repositories.AppUserProjects;

public sealed class AppUserProjectsRepository
    : GenericRepository<ProjectsContext, AppUserProject>,
        IAppUserProjectsRepository
{
    public AppUserProjectsRepository(ProjectsContext context)
        : base(context)
    {
    }

    public async Task<IEnumerable<AppUserProject>> GetByAppUserIdAsync(Guid appUserId)
    {
        return await Queryable.Where(x => x.AppUserId == appUserId).ToListAsync();
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsByAppUserIdAsync(Guid appUserId)
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId)
            .Include(x => x.Project)
            .Select(x => x.ToDto())
            .ToListAsync();
    }

    public async Task<AppUserProject?> GetByAppUserIdAndProjectIdAsync(
        Guid appUserId,
        Guid projectId
    )
    {
        return await Queryable
            .Include(x => x.Project)
            .SingleOrDefaultAsync(x => x.AppUserId == appUserId && x.ProjectId == projectId);
        /*return await Queryable
            .Include(x => x.Project)
            .ThrowHubExceptionIfNullSingleOrDefaultAsync(
                x => x.AppUserId == appUserId && x.ProjectId == projectId,
                "User is not apart of this project"
            );*/
    }

    public async Task<ProjectDto?> GetProjectByAppUserAndProjectIdAsync(
        Guid appUserId,
        Guid projectId
    )
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
}