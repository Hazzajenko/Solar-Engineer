using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using Infrastructure.Logging;
using MassTransit;
using Mediator;
using Projects.Application.Data.UnitOfWork;

namespace Projects.Application.Consumers;

public class UserRejectedInviteToProjectFailedConsumer
    : IConsumer<UserRejectedInviteToProjectFailed>
{
    private readonly IProjectsUnitOfWork _unitOfWork;
    private readonly ILogger<UserRejectedInviteToProjectFailedConsumer> _logger;
    private readonly IMediator _mediator;

    public UserRejectedInviteToProjectFailedConsumer(
        ILogger<UserRejectedInviteToProjectFailedConsumer> logger,
        IProjectsUnitOfWork unitOfWork,
        IMediator mediator
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _mediator = mediator;
    }

    public Task Consume(ConsumeContext<UserRejectedInviteToProjectFailed> context)
    {
        _logger.LogInformation("UserRejectedInviteToProjectFailedConsumer");
        context.Message.DumpObjectJson();
        return Task.CompletedTask;
    }
}
