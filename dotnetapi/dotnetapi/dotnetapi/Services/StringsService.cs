using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using dotnetapi.Repositories;
using FluentValidation;
using FluentValidation.Results;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Services;

public class StringsService : IStringsService
{
    private readonly IStringsRepository _stringsRepository;


    public StringsService(IStringsRepository stringsRepository)
    {
        _stringsRepository = stringsRepository;
    }

    public async Task<StringDto> CreateStringAsync(String request, CancellationToken cancellationToken)
    {
        var existingString = await _stringsRepository.GetStringByIdAsync(request.Id, cancellationToken);
        if (existingString is not null)
        {
            var message = $"A project with id {request.Id} already exists";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return await _stringsRepository.CreateStringAsync(request, cancellationToken);
    }

    public async Task<StringDto?> GetStringByIdAsync(string id, CancellationToken cancellationToken)
    {
        var stringEntity = await _stringsRepository.GetStringByIdAsync(id, cancellationToken);
        if (stringEntity is null)
        {
            var message = $"A string with id {id} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return stringEntity?.ToDto();
    }

    public async Task<IEnumerable<StringDto>> GetAllStringsByProjectIdAsync(int projectId,
        CancellationToken cancellationToken)
    {
        var stringDtos = await _stringsRepository.GetAllStringsByProjectIdAsync(projectId, cancellationToken);
        return stringDtos;
        // return stringDtos.Select(x => x.T());
    }

    public async Task<bool> UpdateStringAsync(String request, String changes, CancellationToken cancellationToken)
    {
        var updateString = await _stringsRepository.UpdateStringAsync(request, changes, cancellationToken);
        if (!updateString)
        {
            var message = $"Error updating string {request.Id}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return updateString;
    }

    public async Task<bool> DeleteAsync(String request, CancellationToken cancellationToken)
    {
        return await _stringsRepository.DeleteAsync(request, cancellationToken);
    }

    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(Project), message)
        };
    }
}