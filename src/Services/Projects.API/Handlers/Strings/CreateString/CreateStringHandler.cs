using Infrastructure.Exceptions;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Data;
using Projects.API.Data;
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
        if (stringId == "undefined") throw new HubException("String Id is undefined");

        var @string = String.Create(command.Request, projectId, appUserId);

        await _unitOfWork.StringsRepository.AddAsync(@string);
        await _unitOfWork.SaveChangesAsync();

        var projectMembers =
            await _unitOfWork.AppUserProjectsRepository.GetProjectMemberIdsByProjectId(
                appUserProject.ProjectId
            );

        /*var response = @string.ToProjectEventResponse(
            appUserId.ToString(),
            command.RequestId,
            ActionType.Create,
            ModelType.String
        );*/
        /*var response = @string.ToProjectEventResponseV2(
            command,
            ActionType.Create,
            ModelType.String
        );*/
        var response = @string.ToProjectEventResponseV3(command, ActionType.Create);

        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .StringsCreated(@string.ToDtoList());
        await _hubContext.Clients.Users(projectMembers).StringsCreated(@string.ToDtoList());*/
        /*await _hubContext.Clients
            .Group(appUserProject.ProjectId.ToString())
            .ReceiveProjectEvents(response.ToIEnumerable());*/
        /*await _hubContext.Clients
            .Users(projectMembers)
            .ReceiveProjectEvents(response.ToIEnumerable());*/
        await _hubContext.Clients.Users(projectMembers).ReceiveProjectEvent(response);

        _logger.LogInformation(
            "User {User} created string {String} in project {Project}",
            appUserId.ToString(),
            @string.Id.ToString(),
            appUserProject.Project.Id
        );

        return true;
    }
}