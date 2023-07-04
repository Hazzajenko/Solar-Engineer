using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Projects.Application.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.AppUserSelectedProjects;

public sealed class AppUserSelectedProjectsRepository
    : GenericRepository<ProjectsContext, AppUserSelectedProject>,
        IAppUserSelectedProjectsRepository
{
    public AppUserSelectedProjectsRepository(ProjectsContext context)
        : base(context) { }

    public async Task<Guid?> GetSelectedProjectIdByAppUserIdAsync(Guid appUserId)
    {
        AppUserSelectedProject? appUserSelectedProject = await Queryable.SingleOrDefaultAsync(
            x => x.Id == appUserId
        );
        return appUserSelectedProject?.ProjectId;
    }

    public async Task<IEnumerable<Guid>> GetActiveUsersInProjectByProjectIdAsync(Guid projectId)
    {
        return await Queryable.Where(x => x.ProjectId == projectId).Select(x => x.Id).ToListAsync();
    }

    public async Task<bool> AddOrUpdateAsync(Guid appUserId, Guid? projectId)
    {
        AppUserSelectedProject? appUserSelectedProject = await Queryable.SingleOrDefaultAsync(
            x => x.Id == appUserId
        );
        if (appUserSelectedProject is null)
        {
            await AddAsync(new AppUserSelectedProject { Id = appUserId, ProjectId = projectId });
            return true;
        }

        appUserSelectedProject.ProjectId = projectId;
        await UpdateAsync(appUserSelectedProject);
        return true;
    }
}
