using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Domain.Commands.Projects;
using Projects.Domain.Entities;
using Projects.SignalR.Hubs;

namespace Projects.Application.Handlers.Projects;

public class CreateProjectHandler : ICommandHandler<CreateProjectCommand, bool>
{
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;
    private readonly ILogger _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public CreateProjectHandler(
        ILogger<CreateProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork,
        IHubContext<ProjectsHub, IProjectsHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(CreateProjectCommand command, CancellationToken cT)
    {
        var appUserId = command.User.Id;
        // var project = request.CreateProjectRequest.ToDomain(appUserId);
        var projectUser = await _unitOfWork.ProjectUsersRepository.GetByIdAsync(appUserId);
        if (projectUser is null)
        {
            _logger.LogError("ProjectUser {User} does not exist", appUserId);
            throw new Exception($"ProjectUser {appUserId} does not exist");
        }

        var appUserProject = AppUserProject.CreateAsOwner(
            command.CreateProjectRequest.Name,
            projectUser.Id
        );
        await _unitOfWork.AppUserProjectsRepository.AddAsync(appUserProject);
        await _unitOfWork.SaveChangesAsync();
        // await _unitOfWork.ProjectsRepository.AddAsync(project);
        // await _unitOfWork.SaveChangesAsync();
        // await _unitOfWork.ProjectsRepository.AddAndSaveChangesAsync(project);

        var response = appUserProject.Project.ToDto();

        await _hubContext.Clients.User(appUserId.ToString()).ProjectCreated(response);
        _logger.LogInformation(
            "User {User} created project {Project}",
            appUserId,
            appUserProject.Project.Name
        );

        return true;
    }
}