using ApplicationCore.Events;
using ApplicationCore.Events.Projects;
using Infrastructure.Logging;
using MassTransit;
using Mediator;
using Projects.Application.Data.UnitOfWork;

namespace Projects.Application.Consumers;

public class InvitedUsersToProjectSuccessConsumer : IConsumer<InvitedUsersToProjectSuccess>
{
    private readonly IProjectsUnitOfWork _unitOfWork;
    private readonly ILogger<InvitedUsersToProjectSuccessConsumer> _logger;
    private readonly IMediator _mediator;

    public InvitedUsersToProjectSuccessConsumer(
        ILogger<InvitedUsersToProjectSuccessConsumer> logger,
        IProjectsUnitOfWork unitOfWork,
        IMediator mediator
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _mediator = mediator;
    }

    public Task Consume(ConsumeContext<InvitedUsersToProjectSuccess> context)
    {
        _logger.LogInformation("InvitedUsersToProjectConsumerSuccess");
        context.Message.DumpObjectJson();
        return Task.CompletedTask;
    }
}
