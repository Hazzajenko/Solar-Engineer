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
        Guid appUserId = command.User.Id;
        var projectId = command.Request.ProjectId.ToGuid();
        AppUserProject? appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowHubExceptionIfNull("User is not apart of this project");

        var panelIds = command.Request.PanelIds;
        IEnumerable<Guid> panelIdGuids = new List<Guid>();
        if (panelIds.Any())
            panelIdGuids = panelIds.Select(Guid.Parse);
        var @string = String.Create(
            (command.Request.String.Id, command.Request.String.Name, command.Request.String.Colour),
            projectId,
            appUserId
        );

        await _unitOfWork.StringsRepository.AddAsync(@string);
        await _unitOfWork.SaveChangesAsync();
        @string = await _unitOfWork.StringsRepository.GetByIdAsync(@string.Id);
        @string.ThrowHubExceptionIfNull("String was not created");

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        ProjectEventResponse stringResponse = @string.ToProjectEventResponseFromEntity(
            command,
            ActionType.Create
        );

        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(stringResponse);

        _logger.LogInformation(
            "User {UserName}: Created String {StringName} in Project {ProjectName}",
            command.User.ToAuthUserLog(),
            @string.Name,
            appUserProject.Project.Name
        );

        if (!panelIdGuids.Any())
            return true;
        await _unitOfWork.PanelsRepository.ExecuteUpdateAsync(
            panel => panelIdGuids.Contains(panel.Id),
            panel => panel.SetProperty(x => x.StringId, x => @string.Id)
        );
        await _unitOfWork.SaveChangesAsync();
        var panels = await _unitOfWork.PanelsRepository.GetManyPanelsAsync(projectId, panelIdGuids);

        ProjectEventResponse response = panels.ToProjectEventResponseFromEntityList(
            command,
            ActionType.UpdateMany,
            true
        );

        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {UserName}: Updated {PanelsAmount} Panels with String {StringName} in Project {ProjectName}",
            command.User.UserName,
            panelIdGuids.Count(),
            @string.Name,
            appUserProject.Project.Name
        );

        return true;
    }
}
