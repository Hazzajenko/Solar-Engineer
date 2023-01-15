using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Requests.Panels;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using dotnetapi.Services.Strings;
using FluentValidation;
using FluentValidation.Results;

namespace dotnetapi.Services.Panels;

public class PanelsService : IPanelsService
{
    private readonly IPanelsRepository _panelsRepository;
    private readonly IProjectsRepository _projectsRepository;
    private readonly IStringsRepository _stringsRepository;


    public PanelsService(
        IPanelsRepository panelsRepository,
        IStringsRepository stringsRepository,
        IProjectsRepository projectsRepository
    )
    {
        _panelsRepository = panelsRepository;
        _stringsRepository = stringsRepository;
        _projectsRepository = projectsRepository;
    }

    public async Task<PanelDto> CreatePanelAsync(Panel request, int projectId, string requestStringId)
    {
        var existingPanel = await _panelsRepository.GetPanelByIdAsync(request.Id);
        if (existingPanel is not null)
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

        var panelString = await _stringsRepository.GetStringByIdAsync(requestStringId);
        if (panelString is null)
        {
            var message = "StringId with Panel does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        request.String = panelString;


        var result = await _panelsRepository.CreatePanelAsync(request);
        return result.ToDto();
    }

    public async Task<int> CreateManyPanelsAsync(IEnumerable<Panel> request, int projectId, string requestStringId)
    {
        var panelString = await _stringsRepository.GetStringByIdAsync(requestStringId);
        if (panelString is null)
        {
            var message = "StringId with Panel does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        var panelCreates = 0;


        foreach (var panel in request)
        {
            var existingPanel = await _panelsRepository.GetPanelByIdAsync(panel.Id);
            if (existingPanel is not null)
            {
                var message = $"A panel with id {panel.Id} already exists";
                throw new ValidationException(message, GenerateValidationError(message));
            }

            var project = _projectsRepository.GetProjectByIdAsync(projectId);
            if (project.Result is null)
            {
                var message = $"A project with id {panel.Id} does not exist";
                throw new ValidationException(message, GenerateValidationError(message));
            }

            panel.Project = project.Result;
            panel.String = panelString;

            await _panelsRepository.CreatePanelAsync(panel);
            panelCreates++;
        }


        return panelCreates;
    }

    public async Task<PanelDto?> GetPanelByIdAsync(string panelId)
    {
        var panelEntity = await _panelsRepository.GetPanelByIdAsync(panelId);
        if (panelEntity is null)
        {
            var message = $"A string with id {panelId} does not exist";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return panelEntity.ToDto();
    }

    public async Task<IEnumerable<PanelDto>> GetAllPanelsByProjectIdAsync(int projectId)
    {
        var panelList = await _panelsRepository.GetAllPanelsByProjectIdAsync(projectId);
        return panelList.Select(x => x.ToDto());
    }

    public async Task<bool> UpdatePanelAsync(UpdatePanelRequest request)
    {
        var updatePanel = await _panelsRepository.UpdatePanelAsync(request);
        if (!updatePanel)
        {
            var message = $"Error updating panel {request.Id}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return updatePanel;
    }

    public async Task<bool[]> UpdateManyPanelsAsync(UpdateManyPanelsRequest request)
    {
        var panelUpdates = new bool[request.Updates.Count()];
        var index = 0;
        foreach (var panel in request.Updates)
        {
            var updatePanel = await _panelsRepository.UpdatePanelAsync(panel);
            if (!updatePanel)
            {
                var message = $"No changes made {panel.Id}";
                // throw new ValidationException(message, GenerateValidationError(message));
                continue;
            }

            panelUpdates[index] = updatePanel;
            index++;
        }

        return panelUpdates;
    }

    public async Task<bool> DeletePanelAsync(string panelId)
    {
        var panelToDelete = await _panelsRepository.GetPanelByIdAsync(panelId);
        if (panelToDelete is null)
        {
            var message = $"Cannot find String {panelId}";
            throw new ValidationException(message, GenerateValidationError(message));
        }

        return await _panelsRepository.DeletePanelAsync(panelToDelete.Id);
    }

    public async Task<bool[]> DeleteManyPanelsAsync(DeleteManyPanelsRequest request)
    {
        var panelDeletes = new bool[request.PanelIds.Count()];
        var index = 0;
        foreach (var panelId in request.PanelIds)
        {
            var deletePanel = await _panelsRepository.DeletePanelAsync(panelId);
            if (!deletePanel)
            {
                var message = $"Error updating panel {panelId}";
                throw new ValidationException(message, GenerateValidationError(message));
            }

            panelDeletes[index] = deletePanel;
            index++;
        }

        return panelDeletes;
    }

    private static ValidationFailure[] GenerateValidationError(string message)
    {
        return new[]
        {
            new ValidationFailure(nameof(Panel), message)
        };
    }
}