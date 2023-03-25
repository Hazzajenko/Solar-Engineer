using Infrastructure.Repositories;
using Projects.Application.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.ProjectUsers;

public sealed class ProjectUsersRepository
    : GenericRepository<ProjectsContext, ProjectUser>,
        IProjectUsersRepository
{
    public ProjectUsersRepository(ProjectsContext context)
        : base(context)
    {
    }
}