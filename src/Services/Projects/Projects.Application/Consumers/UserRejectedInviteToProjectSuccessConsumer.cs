using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using Infrastructure.Logging;
using MassTransit;
using Mediator;
using Projects.Application.Data.UnitOfWork;

namespace Projects.Application.Consumers;

public class UserRejectedInviteToProjectSuccessConsumer
    : IConsumer<UserRejectedInviteToProjectSuccess>
{
    private readonly IProjectsUnitOfWork _unitOfWork;
    private readonly ILogger<UserRejectedInviteToProjectSuccessConsumer> _logger;
    private readonly IMediator _mediator;

    public UserRejectedInviteToProjectSuccessConsumer(
        ILogger<UserRejectedInviteToProjectSuccessConsumer> logger,
        IProjectsUnitOfWork unitOfWork,
        IMediator mediator
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _mediator = mediator;
    }

    public Task Consume(ConsumeContext<UserRejectedInviteToProjectSuccess> context)
    {
        _logger.LogInformation("UserRejectedInviteToProjectSuccessConsumer");
        return Task.CompletedTask;
    }
}
