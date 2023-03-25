using Infrastructure.Data;
using Projects.Application.Repositories.AppUserProjects;
using Projects.Application.Repositories.PanelConfigs;
using Projects.Application.Repositories.PanelLinks;
using Projects.Application.Repositories.Panels;
using Projects.Application.Repositories.Projects;
using Projects.Application.Repositories.ProjectUsers;
using Projects.Application.Repositories.Strings;

namespace Projects.Application.Data.UnitOfWork;

public class ProjectsUnitOfWork : UnitOfWorkFactory<ProjectsContext>, IProjectsUnitOfWork
{
    public ProjectsUnitOfWork(ProjectsContext context)
        : base(context)
    {
    }

    public IProjectUsersRepository ProjectUsersRepository => new ProjectUsersRepository(Context);
    public IProjectsRepository ProjectsRepository => new ProjectsRepository(Context);

    public IAppUserProjectsRepository AppUserProjectsRepository =>
        new AppUserProjectsRepository(Context);

    public IPanelsRepository PanelsRepository => new PanelsRepository(Context);
    public IPanelLinksRepository PanelLinksRepository => new PanelLinksRepository(Context);
    public IPanelConfigsRepository PanelConfigsRepository => new PanelConfigsRepository(Context);
    public IStringsRepository StringsRepository => new StringsRepository(Context);
}