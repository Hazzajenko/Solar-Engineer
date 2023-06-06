using Infrastructure.Contracts.Events;
using MassTransit;
using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Contracts.Events;
using Projects.Domain.Entities;
using Projects.SignalR.Commands.Projects;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class CreateProjectHandler : ICommandHandler<CreateProjectCommand, Guid>
{
    private readonly IRequestClient<CreateProjectEvent> _client;
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public CreateProjectHandler(
        ILogger<CreateProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext, IRequestClient<CreateProjectEvent> client)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _client = client;
    }

    public async ValueTask<Guid> Handle(CreateProjectCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;

        var eventResponse =
            await _client.GetResponse<UserFound, UserNotFound>(new CreateProjectEvent(command.User.Id), cT);

        if (eventResponse.Is(out Response<UserNotFound>? userNotFoundResponse))
        {
            var userNotFound = userNotFoundResponse!.Message;
            _logger.LogError("User {User} not found", userNotFound.Id);
            throw new Exception($"User {appUserId} not found");
        }

        if (eventResponse.Is(out Response<UserFound>? userFoundResponse) is false)
        {
            _logger.LogError("Response is not UserFound: {Response}", eventResponse.GetType().Name);
            throw new InvalidOperationException();
        }

        ArgumentNullException.ThrowIfNull(userFoundResponse);

        appUserId = userFoundResponse.Message.Id;

        var request = command.CreateProjectRequest;
        var appUserProject = AppUserProject.CreateAsOwner(
            appUserId,
            request.Name,
            request.Colour
        );
        await _unitOfWork.AppUserProjectsRepository.AddAsync(appUserProject);
        await _unitOfWork.SaveChangesAsync();

        var response = appUserProject.Project.ToDto();

        await _hubContext.Clients.User(appUserId.ToString()).ProjectCreated(response);
        _logger.LogInformation(
            "User {User} created project {Project}",
            appUserId,
            appUserProject.Project.Name
        );

        return appUserProject.Project.Id;
    }
}