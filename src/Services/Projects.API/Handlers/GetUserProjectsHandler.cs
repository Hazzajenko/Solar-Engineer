using System.Security.Claims;
using Infrastructure.Extensions;
using Mediator;
using Projects.API.Contracts.Data;
using Projects.API.Data;

namespace Projects.API.Handlers;

public sealed record GetUserProjectsQueryV2(ClaimsPrincipal User)
    : IRequest<IEnumerable<ProjectDto>>;

public class GetUserProjectsHandler
    : IRequestHandler<GetUserProjectsQueryV2, IEnumerable<ProjectDto>>
{
    private readonly ILogger<GetUserProjectsHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public GetUserProjectsHandler(
        ILogger<GetUserProjectsHandler> logger,
        IProjectsUnitOfWork unitOfWork
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<IEnumerable<ProjectDto>> Handle(
        GetUserProjectsQueryV2 request,
        CancellationToken cT
    )
    {
        var appUserId = request.User.GetGuidUserId();
        var userProjects = await _unitOfWork.AppUserProjectsRepository.GetProjectsByAppUserIdAsync(
            appUserId
        );

        _logger.LogInformation("User {User} get user projects", appUserId);

        return userProjects;
    }
}