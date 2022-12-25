using dotnetapi.Mapping;
using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;
using dotnetapi.Repositories;
using FluentValidation;
using FluentValidation.Results;

namespace dotnetapi.Services;

public class ProjectsService : IProjectsService
{
    private readonly IProjectsRepository _projectsRepository;

    public ProjectsService(IProjectsRepository projectsRepository)
    {
        _projectsRepository = projectsRepository;
    }

    public async Task<ProjectDto> CreateProjectAsync(AppUserProject appUserProject)
    {
        var existingProject = await _projectsRepository.GetProjectByIdAsync(appUserProject.Project.Id);
        if (existingProject is not null)
        {
            var message = $"A project with id {appUserProject.Project.Id} already exists";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var result = await _projectsRepository.CreateProjectAsync(appUserProject);
        return result.ToDto();
    }

    public async Task<ProjectDto?> GetProjectByIdAsync(int projectId)
    {
        var projectEntity = await _projectsRepository.GetProjectByIdAsync(projectId);
        if (projectEntity is null)
        {
            var message = $"A project with id {projectId} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return projectEntity.ToDto();
    }

    public async Task<IEnumerable<ProjectDto>> GetAllProjectsByUserIdAsync(int userId)
    {
        var projectDtos = await _projectsRepository.GetAllProjectsByUserIdAsync(userId);
        return projectDtos.Select(x => x.ToDto());
    }

    public async Task<bool> UpdateProjectAsync(Project request)
    {
        var updateProject = await _projectsRepository.UpdateProjectAsync(request);
        if (!updateProject)
        {
            var message = $"Error updating project {request.Id}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return updateProject;
    }

    public async Task<bool> DeleteProjectAsync(int projectId)
    {
        var projectToDelete = await _projectsRepository.GetProjectByIdAsync(projectId);
        if (projectToDelete is null)
        {
            var message = $"Cannot find project {projectId}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return await _projectsRepository.DeleteProjectAsync(projectToDelete);
    }

    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(Project), message)
        };
    }
}