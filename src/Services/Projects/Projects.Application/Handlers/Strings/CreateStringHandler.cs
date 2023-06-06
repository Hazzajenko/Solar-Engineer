using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
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

        var panelIds = command.Request.PanelUpdates;
        IEnumerable<Guid> panelIdGuids = new List<Guid>();
        if (panelIds.Any())
            panelIdGuids = panelIds.Select(x => x.Id.ToGuid());
        IEnumerable<Panel>? panels = null;

        var @string = String.Create(
            (command.Request.String.Id, command.Request.String.Name, command.Request.String.Color),
            projectId,
            appUserId
        );

        @string = await _unitOfWork.StringsRepository.AddAndSaveChangesAsync(@string);

        if (panelIdGuids.Any())
        {
            panels = await _unitOfWork.PanelsRepository.GetManyPanelsAsync(projectId, panelIdGuids);
            if (panels.Count() != panelIdGuids.Count())
                throw new HubException("One or more panels not found");
            panels = panels.Select(x => Panel.AddStringId(x, @string.Id));
            await _unitOfWork.PanelsRepository.UpdateManyAndSaveChangesAsync(panels);
        }

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        var stringResponse = @string.ToProjectEventResponseFromEntity(command, ActionType.Create);
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(stringResponse);

        if (panels is not null && panels.Any())
        {
            var panelsResponse = panels.ToProjectEventResponseFromEntityList(
                command,
                ActionType.UpdateMany
            );
            await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(panelsResponse);
        }

        _logger.LogInformation(
            "User {User} created string {String} in project {Project}",
            appUserId.ToString(),
            @string.Id.ToString(),
            appUserProject.Project.Id
        );

        return true;
    }
}