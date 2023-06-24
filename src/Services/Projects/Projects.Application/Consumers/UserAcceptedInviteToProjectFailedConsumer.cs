using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using Infrastructure.Logging;
using MassTransit;
using Mediator;
using Projects.Application.Data.UnitOfWork;

namespace Projects.Application.Consumers;

public class UserAcceptedInviteToProjectFailedConsumer
    : IConsumer<UserAcceptedInviteToProjectFailed>
{
    private readonly IProjectsUnitOfWork _unitOfWork;
    private readonly ILogger<UserAcceptedInviteToProjectFailedConsumer> _logger;
    private readonly IMediator _mediator;

    public UserAcceptedInviteToProjectFailedConsumer(
        ILogger<UserAcceptedInviteToProjectFailedConsumer> logger,
        IProjectsUnitOfWork unitOfWork,
        IMediator mediator
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _mediator = mediator;
    }

    public Task Consume(ConsumeContext<UserAcceptedInviteToProjectFailed> context)
    {
        _logger.LogInformation("UserAcceptedInviteToProjectSuccessConsumer");
        context.Message.DumpObjectJson();
        return Task.CompletedTask;
    }
}
