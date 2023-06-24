using Infrastructure.Extensions;
using Mediator;
using Messages.Application.Data;
using Messages.Application.Data.UnitOfWork;
using Messages.Application.Mapping;
using Messages.SignalR.Commands.GroupChats;
using Messages.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.SignalR;

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

        var appUserResult = message.ToDtoList(appUserId);
        var recipientUserResult = message.ToDtoList(recipientUserId);

        await _hubContext.Clients.User(appUserId.ToString()).GetMessages(appUserResult);

        await _hubContext.Clients.User(recipientUserId.ToString()).GetMessages(recipientUserResult);

        _logger.LogInformation("{User} Sent a Message to {Recipient}", appUserId, recipientUserId);

        return true;
    }
}
