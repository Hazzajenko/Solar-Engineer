using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Projects.Application.Data;
using Projects.Application.Mapping;
using Projects.Domain.Contracts.Data;
using Projects.Domain.Entities;

// using AppUser = Users.API.Entities.AppUser;

namespace Projects.Application.Repositories.AppUserProjects;

public sealed class AppUserProjectsRepository
    : EntityToEntityRepository<ProjectsContext, AppUserProject>,
        IAppUserProjectsRepository
{
    public AppUserProjectsRepository(ProjectsContext context)
        : base(context)
    {
    }

    public async Task<IEnumerable<AppUserProject>> GetByAppUserIdAsync(Guid appUserId)
    {
        return await Queryable.Where(x => x.AppUserId == appUserId).ToListAsync();
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsByAppUserIdAsync(Guid appUserId)
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId)
            .Include(x => x.Project)
            .Select(x => x.ToDto())
            .ToListAsync();
    }

    public async Task<AppUserProject?> GetByAppUserIdAndProjectIdAsync(
        Guid appUserId,
        Guid projectId
    )
    {
        return await Queryable
            .Include(x => x.Project)
            .SingleOrDefaultAsync(x => x.AppUserId == appUserId && x.ProjectId == projectId);
        /*return await Queryable
            .Include(x => x.Project)
            .ThrowHubExceptionIfNullSingleOrDefaultAsync(
                x => x.AppUserId == appUserId && x.ProjectId == projectId,
                "User is not apart of this project"
            );*/
    }

    public async Task<ProjectDto?> GetProjectByAppUserAndProjectIdAsync(
        Guid appUserId,
        Guid projectId
    )
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId && x.ProjectId == projectId)
            .Include(x => x.Project)
            .Select(x => x.ToDto())
            .SingleOrDefaultAsync();
    }

    public async Task<IEnumerable<string>> GetProjectMemberIdsByProjectId(Guid projectId)
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId)
            .Select(x => x.AppUserId.ToString())
            .ToArrayAsync();
    }

    public async Task<IEnumerable<ProjectDto>> GetProjectsWithMembersByAppUserIdAsync(
        Guid appUserId
    )
    {
        return await Queryable
            .Where(x => x.AppUserId == appUserId)
            .Include(x => x.Project)
            .ThenInclude(x => x.AppUserProjects)
            // .ThenInclude(x => x.ProjectUser)
            .Select(
                x =>
                    new ProjectDto
                    {
                        Id = x.Project.Id.ToString(),
                        Name = x.Project.Name,
                        Colour = x.Project.Colour,
                        CreatedTime = x.Project.CreatedTime,
                        LastModifiedTime = x.Project.LastModifiedTime,
                        CreatedById = x.Project.CreatedById.ToString(),
                        MemberIds = x.Project.AppUserProjects.Select(
                            z => z.AppUserId.ToString()
                        ),
                        Members = x.Project.AppUserProjects.Select(
                            z =>
                                new ProjectUserDto
                                {
                                    Id = z.AppUserId.ToString(),
                                    Role = z.Role,
                                    CanCreate = z.CanCreate,
                                    CanDelete = z.CanDelete,
                                    CanInvite = z.CanInvite,
                                    CanKick = z.CanKick,
                                    JoinedAtTime = z.CreatedTime
                                }
                        )
                    }
            )
            // .Select(x => x.ToDto())
            .ToListAsync();
        /*public string Name { get; set; } = default!;
        public string Id { get; set; } = default!;
        public DateTime CreatedTime { get; set; }
        public DateTime LastModifiedTime { get; set; }
        public string CreatedById { get; set; } = default!;*/
    }
}