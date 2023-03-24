using Infrastructure.Repositories;
using Projects.Application.Data;
using Projects.Domain.Entities;

// using AppUser = Users.API.Entities.AppUser;

namespace Projects.Application.Repositories.Projects;

public sealed class ProjectsRepository : GenericRepository<ProjectsContext, Project>,
    IProjectsRepository
{
    public ProjectsRepository(ProjectsContext context) : base(context)
    {
    }
}