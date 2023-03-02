using Infrastructure.Data;
using Projects.API.Repositories.AppUserProjects;
using Projects.API.Repositories.PanelConfigs;
using Projects.API.Repositories.PanelLinks;
using Projects.API.Repositories.Panels;
using Projects.API.Repositories.Projects;
using Projects.API.Repositories.Strings;

namespace Projects.API.Data;

public interface IProjectsUnitOfWork : IUnitOfWorkFactory
{
    IProjectsRepository ProjectsRepository { get; }
    IAppUserProjectsRepository AppUserProjectsRepository { get; }
    IPanelsRepository PanelsRepository { get; }
    IPanelLinksRepository PanelLinksRepository { get; }
    IPanelConfigsRepository PanelConfigsRepository { get; }
    IStringsRepository StringsRepository { get; }

    /*IAppUserProjectsRepository AppUserProjectsRepository { get; }
    IAppUserProjectsRepository AppUserProjectsRepository { get; }
    IAppUserProjectsRepository AppUserProjectsRepository { get; }*/
}