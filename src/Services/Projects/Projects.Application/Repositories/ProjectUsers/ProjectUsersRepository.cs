using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Projects.Application.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.ProjectUsers;

public sealed class ProjectUsersRepository
    : GenericRepository<ProjectsContext, ProjectUser>,
        IProjectUsersRepository
{
    public ProjectUsersRepository(ProjectsContext context)
        : base(context) { }

    public async Task<Guid?> GetSelectedProjectIdByAppUserIdAsync(Guid appUserId)
    {
        ProjectUser? appUserSelectedProject = await Queryable.SingleOrDefaultAsync(
            x => x.Id == appUserId
        );
        return appUserSelectedProject?.SelectedProjectId;
    }

    public async Task<bool> SetSelectedProjectIdByAppUserIdAsync(
        Guid appUserId,
        Guid? selectedProjectId
    )
    {
        ProjectUser? appUserSelectedProject = await Queryable.SingleOrDefaultAsync(
            x => x.Id == appUserId
        );
        ArgumentNullException.ThrowIfNull(appUserSelectedProject);

        appUserSelectedProject.SelectedProjectId = selectedProjectId;

        await SaveChangesAsync();
        return true;
    }
}
