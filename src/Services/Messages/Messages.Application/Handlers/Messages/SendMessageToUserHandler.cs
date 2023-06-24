using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Mediator;
using Messages.Application.Data.UnitOfWork;
using Messages.Application.Mapping;
using Messages.Contracts.Responses;
using Messages.SignalR.Commands.GroupChats;
using Messages.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.Messages;

public class SendMessageToUserHandler : IQueryHandler<SendMessageToUserCommand, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<SendMessageToUserHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;

    public SendMessageToUserHandler(
        ILogger<SendMessageToUserHandler> logger,
        IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(SendMessageToUserCommand command, CancellationToken cT)
    {
        var appUserId = command.AuthUser.Id;
        var recipientUserId = command.MessageRequest.RecipientUserId.ToGuid();

        var message = command.MessageRequest.ToEntity(appUserId, recipientUserId);

        await _unitOfWork.MessagesRepository.AddAsync(message);
        await _unitOfWork.SaveChangesAsync();

        // var appUserResult = message.ToDtoList(appUserId);
        // var recipientUserResult = message.ToDtoList(recipientUserId);
        var appUserResult = message.ToDto(appUserId);
        var recipientUserResult = message.ToDto(recipientUserId);
        await _hubContext.Clients
            .User(appUserId.ToString())
            .ReceiveMessage(new ReceiveMessageResponse { Message = appUserResult });

        await _hubContext.Clients
            .User(recipientUserId.ToString())
            .ReceiveMessage(new ReceiveMessageResponse { Message = recipientUserResult });

        _logger.LogInformation("{User} Sent a Message to {Recipient}", appUserId, recipientUserId);

        return true;
    }
}
