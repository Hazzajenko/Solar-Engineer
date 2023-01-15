using dotnetapi.Contracts.Requests;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using FluentValidation;
using FluentValidation.Results;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Services.Strings;

public class StringsService : IStringsService
{
    private readonly IProjectsRepository _projectsRepository;
    private readonly IStringsRepository _stringsRepository;


    public StringsService(IStringsRepository stringsRepository,
        IProjectsRepository projectsRepository
    )
    {
        _stringsRepository = stringsRepository;
        _projectsRepository = projectsRepository;
    }

    public async Task<StringDto> CreateStringAsync(String request, int projectId)
    {
        var existingString = await _stringsRepository.GetStringByIdAsync(request.Id);
        if (existingString is not null)
        {
            var message = $"A project with id {request.Id} already exists";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var project = _projectsRepository.GetProjectByIdAsync(projectId);
        if (project.Result == null)
        {
            var message = $"A project with id {request.Id} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        request.Project = project.Result;

        var result = await _stringsRepository.CreateStringAsync(request);
        return result.ToDto();
    }

    public async Task<StringDto?> GetStringByIdAsync(string id)
    {
        var stringEntity = await _stringsRepository.GetStringByIdAsync(id);
        if (stringEntity is null)
        {
            var message = $"A string with id {id} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return stringEntity.ToDto();
    }

    public async Task<IEnumerable<StringDto>> GetAllStringsByProjectIdAsync(int projectId)
    {
        var stringDtos = await _stringsRepository.GetAllStringsByProjectIdAsync(projectId);
        return stringDtos.Select(x => x.ToDto());
    }

    public async Task<bool> UpdateStringAsync(UpdateStringRequest request)
    {
        var updateString = await _stringsRepository.UpdateStringAsync(request);
        if (!updateString)
        {
            var message = $"Error updating string {request.Id}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return updateString;
    }

    public async Task<bool> DeleteAsync(string stringId)
    {
        var stringToDelete = await _stringsRepository.GetStringByIdAsync(stringId);
        if (stringToDelete is null)
        {
            var message = $"Cannot find String {stringId}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return await _stringsRepository.DeleteStringAsync(stringToDelete);
    }

    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(Project), message)
        };
    }
}