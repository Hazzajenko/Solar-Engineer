using System.Security.Claims;
using Infrastructure.Extensions;
using Mediator;
using Projects.API.Contracts.Requests;
using Projects.API.Contracts.Requests.Projects;
using Projects.API.Data;
using Projects.API.Mapping;

namespace Projects.API.Handlers;

public sealed record CreateProjectCommand(
    ClaimsPrincipal User,
    CreateProjectRequest CreateProjectRequest
) : IRequest<bool>;

public class CreateProjectHandler : IRequestHandler<CreateProjectCommand, bool>
{
    private readonly ILogger _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public CreateProjectHandler(
        ILogger<CreateProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(CreateProjectCommand request, CancellationToken cT)
    {
        var appUserId = request.User.GetGuidUserId();
        var project = request.CreateProjectRequest.ToDomain(appUserId);
        await _unitOfWork.ProjectsRepository.AddAsync(project);
        await _unitOfWork.SaveChangesAsync();

        _logger.LogInformation("User {User} created project {Project}", appUserId, project.Name);

        return true;
    }
}