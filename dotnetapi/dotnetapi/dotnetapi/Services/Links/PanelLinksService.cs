using dotnetapi.Mapping;
using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;
using dotnetapi.Repositories.Links;
using dotnetapi.Repositories.Panels;
using dotnetapi.Repositories.Projects;
using dotnetapi.Repositories.Strings;
using FluentValidation;
using FluentValidation.Results;

namespace dotnetapi.Services.Links;

public class PanelLinksService : IPanelLinksService
{
    private readonly IPanelLinksRepository _panelLinksRepository;
    private readonly IPanelsRepository _panelsRepository;
    private readonly IProjectsRepository _projectsRepository;
    private readonly IStringsRepository _stringsRepository;

    public PanelLinksService(
        IPanelsRepository panelsRepository,
        IStringsRepository stringsRepository,
        IProjectsRepository projectsRepository,
        IPanelLinksRepository panelLinksRepository
    )
    {
        _panelsRepository = panelsRepository;
        _stringsRepository = stringsRepository;
        _projectsRepository = projectsRepository;
        _panelLinksRepository = panelLinksRepository;
    }

    public async Task<PanelLinkDto?> GetPanelLinkByIdAsync(string panelLinkId)
    {
        var linkEntity = await _panelLinksRepository.GetPanelLinkByIdAsync(panelLinkId);
        if (linkEntity is null)
        {
            var message = $"A panel link with id {panelLinkId} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return linkEntity.ToDto();
    }

    public async Task<IEnumerable<PanelLinkDto>> GetAllPanelLinksByProjectIdAsync(int projectId)
    {
        var panelList = await _panelLinksRepository.GetAllPanelLinksByProjectIdAsync(projectId);
        return panelList.Select(x => x.ToDto());
    }

    public async Task<bool> DeletePanelLinkAsync(string panelLinkId)
    {
        var linkToDelete = await _panelLinksRepository.GetPanelLinkByIdAsync(panelLinkId);
        if (linkToDelete is null)
        {
            var message = $"Cannot find Panel Link {panelLinkId}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return await _panelLinksRepository.DeletePanelLinkAsync(linkToDelete.Id);
    }

    public async Task<PanelLinkDto> CreatePanelLinkAsync(PanelLink request)
    {
        var existingPanelLink = await _panelLinksRepository.GetPanelLinkByIdAsync(request.Id);
        if (existingPanelLink is not null)
        {
            var message = $"A panel link with id {request.Id} already exists";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var project = _projectsRepository.GetProjectByIdAsync(request.ProjectId);
        if (project.Result is null)
        {
            var message = $"A project with id {request.Id} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var panelString = await _stringsRepository.GetStringByIdAsync(request.StringId);
        if (panelString is null)
        {
            var message = "StringId with Panel does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var positiveLink = await _panelsRepository.GetPanelByIdAsync(request.PositiveToId);
        if (positiveLink is null)
        {
            var message = "PositiveId Panel does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var negativeLink = await _panelsRepository.GetPanelByIdAsync(request.NegativeToId);
        if (negativeLink is null)
        {
            var message = "PositiveId Panel does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }


        request.Project = project.Result;
        request.String = panelString;
        request.PositiveTo = positiveLink;
        request.NegativeTo = negativeLink;


        var result = await _panelLinksRepository.CreatePanelLinkAsync(request);
        return result.ToDto();
    }

    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(Panel), message)
        };
    }
}