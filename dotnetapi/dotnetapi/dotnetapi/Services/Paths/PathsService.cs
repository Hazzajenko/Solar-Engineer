using dotnetapi.Contracts.Requests.Paths;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;
using dotnetapi.Repositories.Panels;
using dotnetapi.Repositories.Paths;
using dotnetapi.Repositories.Projects;
using dotnetapi.Repositories.Strings;
using FluentValidation;
using FluentValidation.Results;
using Path = dotnetapi.Models.Entities.Path;

namespace dotnetapi.Services.Paths;

public class PathsService : IPathsService
{
    private readonly IPanelsRepository _panelsRepository;
    private readonly IPathsRepository _pathsRepository;
    private readonly IProjectsRepository _projectsRepository;
    private readonly IStringsRepository _stringsRepository;


    public PathsService(IPathsRepository pathsRepository,
        IProjectsRepository projectsRepository,
        IPanelsRepository panelsRepository,
        IStringsRepository stringsRepository
    )
    {
        _pathsRepository = pathsRepository;
        _projectsRepository = projectsRepository;
        _panelsRepository = panelsRepository;
        _stringsRepository = stringsRepository;
    }

    public async Task<PathDto> CreatePathAsync(Path request, int projectId)
    {
        var existingPath = await _pathsRepository.GetPathByIdAsync(request.Id);
        if (existingPath is not null)
        {
            var message = $"A panel with id {request.Id} already exists";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var project = _projectsRepository.GetProjectByIdAsync(projectId);
        if (project.Result is null)
        {
            var message = $"A project with id {request.Id} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        request.Project = project.Result;

        var pathString = await _stringsRepository.GetStringByIdAsync(request.StringId);
        if (pathString is null)
        {
            var message = "StringId with Panel does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        request.String = pathString;

        var pathPanel = await _panelsRepository.GetPanelByIdAsync(request.PanelId);
        if (pathPanel is null)
        {
            var message = "StringId with Panel does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        request.String = pathString;


        var result = await _pathsRepository.CreatePathAsync(request);
        return result.ToDto();
    }

    public async Task<PathDto?> GetPathByIdAsync(string pathId)
    {
        var pathEntity = await _pathsRepository.GetPathByIdAsync(pathId);
        if (pathEntity is null)
        {
            var message = $"A path with id {pathId} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return pathEntity.ToDto();
    }

    public async Task<IEnumerable<PathDto>> GetAllPathsByProjectIdAsync(int projectId)
    {
        var pathList = await _pathsRepository.GetAllPathsByProjectIdAsync(projectId);
        return pathList.Select(x => x.ToDto());
    }

    public async Task<bool> UpdatePathAsync(UpdatePathRequest request)
    {
        var updatePath = await _pathsRepository.UpdatePathAsync(request);
        if (!updatePath)
        {
            var message = $"Error updating path {request.Id}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return updatePath;
    }

    public async Task<bool> DeletePathAsync(string pathId)
    {
        var pathToDelete = await _pathsRepository.GetPathByIdAsync(pathId);
        if (pathToDelete is null)
        {
            var message = $"Cannot find Path {pathId}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return await _pathsRepository.DeletePathAsync(pathToDelete.Id);
    }


    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(Panel), message)
        };
    }
}