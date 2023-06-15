﻿using Infrastructure.Events;
using Infrastructure.Logging;
using MassTransit;
using Mediator;
using Projects.Application.Data.UnitOfWork;

namespace Projects.Application.Consumers;

public class InvitedUsersToProjectFailedConsumer : IConsumer<InvitedUsersToProjectFailed>
{
    private readonly IProjectsUnitOfWork _unitOfWork;
    private readonly ILogger<InvitedUsersToProjectFailedConsumer> _logger;
    private readonly IMediator _mediator;

    public InvitedUsersToProjectFailedConsumer(
        ILogger<InvitedUsersToProjectFailedConsumer> logger,
        IProjectsUnitOfWork unitOfWork,
        IMediator mediator
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _mediator = mediator;
    }

    public Task Consume(ConsumeContext<InvitedUsersToProjectFailed> context)
    {
        _logger.LogInformation("InvitedUsersToProjectConsumerFailed");
        context.Message.DumpObjectJson();
        return Task.CompletedTask;
    }
}