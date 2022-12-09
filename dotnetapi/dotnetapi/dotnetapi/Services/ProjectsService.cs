using dotnetapi.Models.Dtos;
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
    
    public async Task<ProjectDto> CreateProject(AppUserProject appUserProject, CancellationToken cancellationToken)
    {
        var existingProject = await _projectsRepository.GetById(appUserProject.Project.Id, cancellationToken);
        if (existingProject is not null)
        {
            var message = $"A project with id {appUserProject.Project.Id} already exists";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return await _projectsRepository.CreateProject(appUserProject, cancellationToken);
    }
    
    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new []
        {
            new ValidationFailure(nameof(Project), message)
        };
    }
}