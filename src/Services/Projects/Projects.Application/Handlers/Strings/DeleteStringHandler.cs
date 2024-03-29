﻿using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using Infrastructure.Extensions;
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

public class DeleteStringHandler : ICommandHandler<DeleteStringCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<DeleteStringHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public DeleteStringHandler(
        ILogger<DeleteStringHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(DeleteStringCommand command, CancellationToken cT)
    {
        Guid appUserId = command.User.Id;
        var projectId = command.ProjectId.ToGuid();
        AppUserProject? appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowHubExceptionIfNull("User is not apart of this project");

        var stringId = command.Request.StringId.ToGuid();

        var deleteResult = await _unitOfWork.StringsRepository.DeleteStringByIdAndProjectIdAsync(
            stringId,
            projectId
        );
        if (!deleteResult)
            throw new HubException("String not found");

        var stringIdString = stringId.ToString();

        ProjectEventResponse response = stringIdString.ToProjectEventResponseFromId<String>(
            command,
            ActionType.Delete
        );

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {UserName}: Deleted String {StringId} in Project {ProjectName}",
            command.User.ToAuthUserLog(),
            stringId,
            appUserProject.Project.Name
        );

        return true;
    }
}
