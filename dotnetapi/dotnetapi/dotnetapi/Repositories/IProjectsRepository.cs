using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Repositories;

public interface IProjectsRepository
{
    Task<Project?> GetById(int projectId, CancellationToken cancellationToken);
    Task<ProjectDto> CreateProject(AppUserProject request, CancellationToken cancellationToken);
}