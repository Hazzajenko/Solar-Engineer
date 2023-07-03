using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Infrastructure.Logging;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Contracts.Responses;
using Projects.Domain.Common;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Strings;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Strings;

public class CreateStringHandler : ICommandHandler<CreateStringCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<CreateStringHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public CreateStringHandler(
        ILogger<CreateStringHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(CreateStringCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        var projectId = command.Request.ProjectId.ToGuid();
        var appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowExceptionIfNull(new HubException("User is not apart of this project"));

        var stringId = command.Request.String.Id;
        if (stringId == "undefined")
            throw new HubException("String Id is undefined");

        var panelIds = command.Request.PanelIds;
        IEnumerable<Guid> panelIdGuids = new List<Guid>();
        if (panelIds.Any())
            panelIdGuids = panelIds.Select(Guid.Parse);
        // IEnumerable<Panel>? panels = null;

        var @string = String.Create(
            (command.Request.String.Id, command.Request.String.Name, command.Request.String.Colour),
            projectId,
            appUserId
        );

        @string = await _unitOfWork.StringsRepository.AddAndSaveChangesAsync(@string);

        /*if (panelIdGuids.Any())
        {
            /*panels = await _unitOfWork.PanelsRepository.GetManyPanelsAsync(projectId, panelIdGuids);
            if (panels.Count() != panelIdGuids.Count())
            {
                _logger.LogError(
                    "One or more panels not found. ProjectId: {ProjectId}, PanelIdCount: {PanelIdCount} - PanelIdGuidCount: {PanelIdGuidCount}",
                    projectId,
                    panels.Count(),
                    panelIdGuids.Count()
                );
                throw new HubException("One or more panels not found");
            }#1#

            /*panels = await _unitOfWork.PanelsRepository.GetManyPanelsAsync(projectId, panelIdGuids);
            if (panels.Count() != panelIdGuids.Count())
                throw new HubException("One or more panels not found");
            panels = panels.Select(x => Panel.AddStringId(x, @string.Id));
            await _unitOfWork.PanelsRepository.UpdateManyAndSaveChangesAsync(panels);#1#
            await _unitOfWork.PanelsRepository.ExecuteUpdateAsync(
                panel => panelIdGuids.Contains(panel.Id),
                panel => panel.SetProperty(x => x.StringId, x => @string.Id)
            );
        }*/

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        var stringResponse = @string.ToProjectEventResponseFromEntity(command, ActionType.Create);

        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(stringResponse);

        _logger.LogInformation(
            "User {User} created string {String} in project {Project}",
            appUserId.ToString(),
            @string.Id.ToString(),
            appUserProject.Project.Id
        );

        if (panelIdGuids.Any())
        {
            await _unitOfWork.PanelsRepository.ExecuteUpdateAsync(
                panel => panelIdGuids.Contains(panel.Id),
                panel => panel.SetProperty(x => x.StringId, x => @string.Id)
            );
            var panels = await _unitOfWork.PanelsRepository.GetManyPanelsAsync(
                projectId,
                panelIdGuids
            );

            var panelChanges = panels.ToUpdatedStringResponse();
            var json = panelChanges.ToJson();

            // var newRes = new Dictionary<string, object>();
            // newRes.Add("Action", "");
            // newRes.Add("panels", json);

            var response = new ProjectEventResponse
            {
                RequestId = command.RequestId,
                ProjectId = projectId.ToString(),
                Action = ActionType.UpdateMany,
                Model = nameof(Panel),
                ByAppUserId = appUserId.ToString(),
                Appending = true,
                IsSuccess = true,
                Data = json
            };

            await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

            _logger.LogInformation(
                "User {User} updated {PanelsAmount} panels with string {String} in project {Project}",
                appUserId.ToString(),
                panelIdGuids.Count(),
                @string.Id.ToString(),
                appUserProject.Project.Id
            );
        }

        return true;
    }
}
