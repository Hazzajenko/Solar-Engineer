﻿using Mediator;
using Microsoft.AspNetCore.SignalR;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Mapping;
using Projects.Domain.Commands.Projects;
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

    public async ValueTask<bool> Handle(CreateProjectCommand request, CancellationToken cT)
    {
        var appUserId = request.User.Id;
        var project = request.CreateProjectRequest.ToDomain(appUserId);
        // await _unitOfWork.ProjectsRepository.AddAsync(project);
        // await _unitOfWork.SaveChangesAsync();
        await _unitOfWork.ProjectsRepository.AddAndSaveChangesAsync(project);

        var response = project.ToDto();

        await _hubContext.Clients.User(appUserId.ToString()).ProjectCreated(response);
        _logger.LogInformation("User {User} created project {Project}", appUserId, project.Name);

        return true;
    }
}