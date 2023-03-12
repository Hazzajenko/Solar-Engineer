using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Entities;
using Projects.API.Hubs;
using Projects.API.Mapping;

namespace Projects.API.Handlers.Strings.CreateString;

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

        var stringId = command.Request.Id;
        if (stringId == "undefined")
            throw new HubException("String Id is undefined");

        // String @string;

        var panelIds = command.Request.PanelIds;
        IEnumerable<Guid> panelIdGuids = new List<Guid>();
        if (panelIds is not null && panelIds.Any())
            panelIdGuids = panelIds.Select(x => x.Id.ToGuid());
        // var panelIdGuids = panelIds.Any() ? panelIds.Select(x => x.Id.ToGuid());
        IEnumerable<Panel>? panels = null;
        /*  if (panelIdGuids.Any())
         {
             panels = await _unitOfWork.PanelsRepository.GetManyPanelsAsync(projectId, panelIdGuids);
             if (panels.Count() != panelIdGuids.Count())
                 throw new HubException("One or more panels not found");
             // @string = String.CreateWithPanelNoIds(command.Request, projectId, appUserId, panels);
             // @string = String.CreateWithPanels(command.Request, projectId, appUserId, panels);
             // panels = panels.Select(x => Panel.AddStringId(x, @string.Id));
             // panels = panels.Select(x => x.AddString(@string));
         }
         else
         {
             // @string = String.Create(command.Request, projectId, appUserId);
         }*/
        var @string = String.Create(command.Request, projectId, appUserId);
        // var @string = String.CreateNoId(command.Request, projectId, appUserId);
        // var @string = String.Create(command.Request, projectId, appUserId);

        @string = await _unitOfWork.StringsRepository.AddAndSaveChangesAsync(@string);
        // await _unitOfWork.StringsRepository.AddAsync(@string);

        /*
        if (panels is not null && panels.Any())
            await _unitOfWork.PanelsRepository.UpdateManyAndSaveChangesAsync(panels);*/

        // await _unitOfWork.SaveChangesAsync();

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