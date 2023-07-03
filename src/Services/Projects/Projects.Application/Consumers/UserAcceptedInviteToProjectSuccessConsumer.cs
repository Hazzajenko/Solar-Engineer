using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using Infrastructure.Logging;
using MassTransit;
using Mediator;
using Projects.Application.Data.UnitOfWork;

namespace Projects.Application.Consumers;

public class UserAcceptedInviteToProjectSuccessConsumer : IConsumer<UserAcceptedInviteToProjectSuccess>
{
    private readonly IProjectsUnitOfWork _unitOfWork;
    private readonly ILogger<UserAcceptedInviteToProjectSuccessConsumer> _logger;
    private readonly IMediator _mediator;

    public UserAcceptedInviteToProjectSuccessConsumer(
        ILogger<UserAcceptedInviteToProjectSuccessConsumer> logger,
        IProjectsUnitOfWork unitOfWork,
        IMediator mediator
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _mediator = mediator;
    }

    public Task Consume(ConsumeContext<UserAcceptedInviteToProjectSuccess> context)
    {
        _logger.LogInformation("UserAcceptedInviteToProjectSuccessConsumer");
        return Task.CompletedTask;
    }
}
