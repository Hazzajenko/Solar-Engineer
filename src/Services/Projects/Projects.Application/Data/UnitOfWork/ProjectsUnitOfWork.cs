using Infrastructure.Data;
using Projects.Application.Repositories.AppUserProjects;
using Projects.Application.Repositories.PanelConfigs;
using Projects.Application.Repositories.PanelLinks;
using Projects.Application.Repositories.Panels;
using Projects.Application.Repositories.Projects;
using Projects.Application.Repositories.ProjectUsers;
using Projects.Application.Repositories.Strings;
using Projects.Domain.Common;
using Projects.Domain.Entities;
using Serilog;

namespace Projects.Application.Data.UnitOfWork;

public class ProjectsUnitOfWork : UnitOfWorkFactory<ProjectsContext>, IProjectsUnitOfWork
{
    public ProjectsUnitOfWork(ProjectsContext context)
        : base(context) { }

    public IProjectsRepository ProjectsRepository => new ProjectsRepository(Context);

    public IAppUserProjectsRepository AppUserProjectsRepository =>
        new AppUserProjectsRepository(Context);

    public IPanelsRepository PanelsRepository => new PanelsRepository(Context);
    public IPanelLinksRepository PanelLinksRepository => new PanelLinksRepository(Context);
    public IPanelConfigsRepository PanelConfigsRepository => new PanelConfigsRepository(Context);
    public IStringsRepository StringsRepository => new StringsRepository(Context);

    public IProjectUsersRepository ProjectUsersRepository => new ProjectUsersRepository(Context);

    public new async Task<bool> SaveChangesAsync()
    {
        UpdateProjectLastModifiedTimeBeforeSave();
        return await base.SaveChangesAsync();
    }

    private void UpdateProjectLastModifiedTimeBeforeSave()
    {
        foreach (var entry in Context.ChangeTracker.Entries<IProjectItem>().ToList())
        {
            IProjectItem entity = entry.Entity;
            Guid projectId = entity.ProjectId;
            Project? project = Context.Projects.Find(projectId);
            if (project is null)
            {
                Log.Logger.Error("Project with id {ProjectId} not found", projectId);
                continue;
            }

            project.LastModifiedTime = DateTime.UtcNow;
            Log.Logger.Information(
                "Project with id {ProjectId} updated, LastModifiedTime: {DateTime}",
                projectId,
                DateTime.UtcNow
            );
        }
    }
}
