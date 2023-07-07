using ApplicationCore.Exceptions;
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

public class UpdateStringHandler : ICommandHandler<UpdateStringCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger<UpdateStringHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public UpdateStringHandler(
        ILogger<UpdateStringHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(UpdateStringCommand command, CancellationToken cT)
    {
        Guid appUserId = command.User.Id;
        var projectId = command.Request.ProjectId.ToGuid();
        AppUserProject? appUserProject =
            await _unitOfWork.AppUserProjectsRepository.GetByAppUserIdAndProjectIdAsync(
                appUserId,
                projectId
            );
        appUserProject.ThrowHubExceptionIfNull("User is not apart of this project");

        var stringId = command.Request.Update.Id.ToGuid();

        String @string = await _unitOfWork.StringsRepository.GetByIdAndProjectIdAsync(
            stringId,
            projectId
        );
        @string.ThrowHubExceptionIfNull("String not found");

        StringChanges changes = command.Request.Update.Changes;

        _unitOfWork.Attach(@string);
        if (changes.Name is not null)
            @string.Name = changes.Name;

        if (changes.Colour is not null)
            @string.Colour = changes.Colour;

        if (changes.Parallel is not null)
            @string.Parallel = (bool)changes.Parallel;

        await _unitOfWork.StringsRepository.UpdateAsync(@string);
        await _unitOfWork.SaveChangesAsync();

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        ProjectEventResponse response = @string.ToProjectEventResponseFromEntity(
            command,
            ActionType.Update
        );
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {UserName}: Updated String {StringName} in Project {ProjectName}",
            command.User.UserName,
            @string.Name,
            appUserProject.Project.Name
        );

        return true;
    }
}
