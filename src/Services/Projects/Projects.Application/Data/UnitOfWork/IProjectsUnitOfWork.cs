using Infrastructure.Data;
using Projects.Application.Repositories.AppUserProjects;
using Projects.Application.Repositories.PanelConfigs;
using Projects.Application.Repositories.PanelLinks;
using Projects.Application.Repositories.Panels;
using Projects.Application.Repositories.Projects;
using Projects.Application.Repositories.ProjectUsers;
using Projects.Application.Repositories.Strings;

namespace Projects.Application.Data.UnitOfWork;

public interface IProjectsUnitOfWork : IUnitOfWorkFactory
{
    IProjectUsersRepository ProjectUsersRepository { get; }
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