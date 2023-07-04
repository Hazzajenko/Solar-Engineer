using Infrastructure.Repositories;
using Mapster;
using Microsoft.EntityFrameworkCore;
using Projects.Application.Data;
using Projects.Application.Mapping;
using Projects.Contracts.Data;
using Projects.Domain.Entities;

// using AppUser = Users.API.Entities.AppUser;

namespace Projects.Application.Repositories.AppUserProjects;

public sealed class AppUserProjectsRepository
    : EntityToEntityRepository<ProjectsContext, AppUserProject>,
        IAppUserProjectsRepository
{
    public AppUserProjectsRepository(ProjectsContext context)
        : base(context) { }

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

    public async Task<IEnumerable<string>> GetActiveProjectMemberIdsByProjectId(Guid projectId)
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId)
            .Include(x => x.ProjectUser)
            .Where(x => x.ProjectUser.SelectedProjectId == projectId)
            .Select(x => x.AppUserId.ToString())
            .ToArrayAsync();
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsWithMembersByAppUserIdAsync(
        Guid appUserId
    )
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId)
            .Include(x => x.Project)
            .ThenInclude(x => x.AppUserProjects)
            .ProjectToType<ProjectDto>()
            .ToListAsync();
    }
}
