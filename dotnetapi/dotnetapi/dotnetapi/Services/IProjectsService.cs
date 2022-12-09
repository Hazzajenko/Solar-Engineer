using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services;

public interface IProjectsService
{
    Task<ProjectDto> CreateProject(AppUserProject appUserProject, CancellationToken cancellationToken);
}