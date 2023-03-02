using Infrastructure.Repositories;
using Projects.API.Data;
using Projects.API.Entities;

// using AppUser = Users.API.Entities.AppUser;

namespace Projects.API.Repositories.Projects;

public sealed class ProjectsRepository : GenericRepository<ProjectsContext, Project>,
    IProjectsRepository
{
    public ProjectsRepository(ProjectsContext context) : base(context)
    {
    }
}