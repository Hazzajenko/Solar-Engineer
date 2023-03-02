using Infrastructure.Data;
using Projects.API.Repositories.AppUserProjects;
using Projects.API.Repositories.PanelConfigs;
using Projects.API.Repositories.PanelLinks;
using Projects.API.Repositories.Panels;
using Projects.API.Repositories.Projects;
using Projects.API.Repositories.Strings;

namespace Projects.API.Data;

public class ProjectsUnitOfWork : UnitOfWorkFactory<ProjectsContext>, IProjectsUnitOfWork
{
    public ProjectsUnitOfWork(ProjectsContext context)
        : base(context)
    {
    }

    public IProjectsRepository ProjectsRepository => new ProjectsRepository(Context);

    public IAppUserProjectsRepository AppUserProjectsRepository =>
        new AppUserProjectsRepository(Context);

    public IPanelsRepository PanelsRepository => new PanelsRepository(Context);
    public IPanelLinksRepository PanelLinksRepository => new PanelLinksRepository(Context);
    public IPanelConfigsRepository PanelConfigsRepository => new PanelConfigsRepository(Context);
    public IStringsRepository StringsRepository => new StringsRepository(Context);
}