using System.Security.Claims;
using Infrastructure.Extensions;
using Mediator;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Entities;

namespace Projects.API.Handlers;

public sealed record GetUserProjectsQuery
    (ClaimsPrincipal User) : IRequest<IEnumerable<ProjectDto>>;

public class
    GetUserProjectsHandler : IRequestHandler<GetUserProjectsQuery, IEnumerable<ProjectDto>>
{
    private readonly Logger<GetUserProjectsHandler> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public GetUserProjectsHandler(Logger<GetUserProjectsHandler> logger, IProjectsUnitOfWork unitOfWork)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<IEnumerable<ProjectDto>>
        Handle(GetUserProjectsQuery request, CancellationToken cT)
    {
        var appUserId = request.User.GetGuidUserId();
        var userProjects = await _unitOfWork.AppUserProjectsRepository.GetProjectsByAppUserIdAsync(appUserId);

        _logger.LogInformation("User {User} get user projects", appUserId);

        return userProjects;
    }
}