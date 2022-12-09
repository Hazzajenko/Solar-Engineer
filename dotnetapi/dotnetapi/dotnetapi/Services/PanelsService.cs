using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using dotnetapi.Repositories;
using FluentValidation;
using FluentValidation.Results;

namespace dotnetapi.Services;

public class PanelsService : IPanelsService
{
    private readonly IPanelsRepository _panelsRepository;
    private readonly IStringsRepository _stringsRepository;


    public PanelsService(
        IPanelsRepository panelsRepository,
        IStringsRepository stringsRepository
    )
    {
        _panelsRepository = panelsRepository;
        _stringsRepository = stringsRepository;
    }

    public async Task<PanelDto> CreatePanel(Panel request, CancellationToken cancellationToken)
    {
        var existingPanel = await _panelsRepository.GetById(request.Id, cancellationToken);
        if (existingPanel is not null)
        {
            var message = $"A panel with id {request.Id} already exists";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        if (request.StringId != "undefined")
        {
            var panelString = await _stringsRepository.GetStringByIdAsync(request.StringId, cancellationToken);
            if (panelString is null)
            {
                var message = "StringId with Panel does not exist";
                throw new ValidationException(message, GenerateValidationError(message));
            }

            request.String = panelString;
        }

        return await _panelsRepository.CreatePanel(request, cancellationToken);
    }

    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(Panel), message)
        };
    }
}