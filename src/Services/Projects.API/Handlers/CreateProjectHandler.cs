namespace Projects.API.Handlers;

/*public sealed record CreateProjectCommand(
    ClaimsPrincipal User,
    CreateProjectRequest CreateProjectRequest
) : IRequest<bool>;*/
/*public class CreateProjectHandler : IRequestHandler<CreateProjectCommand, bool>
{
    private readonly ILogger _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;
    private readonly IHubContext<ProjectsHub, IProjectsHub> _hubContext;

    public CreateProjectHandler(
        ILogger<CreateProjectHandler> logger,
        IProjectsUnitOfWork unitOfWork, IHubContext<ProjectsHub, IProjectsHub> hubContext)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
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
}*/