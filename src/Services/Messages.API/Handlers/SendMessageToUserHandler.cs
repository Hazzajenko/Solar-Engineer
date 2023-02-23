using Infrastructure.Extensions;
using Mediator;
using Messages.API.Contracts.Requests;
using Messages.API.Data;
using Messages.API.Hubs;
using Messages.API.Mapping;
using Microsoft.AspNetCore.SignalR;

namespace Messages.API.Handlers;

public sealed record SendMessageToUserCommand(HubCallerContext Context, SendMessageRequest MessageRequest)
    : IQuery<bool>;

public class SendMessageToUserHandler
    : IQueryHandler<SendMessageToUserCommand, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<SendMessageToUserHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;


    public SendMessageToUserHandler(ILogger<SendMessageToUserHandler> logger, IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(
        SendMessageToUserCommand request,
        CancellationToken cT
    )
    {
        if (request.Context.User is null) throw new HubException("Context user is null");

        var appUserId = request.Context.User.GetUserId().ToGuid();
        var recipientUserId = request.MessageRequest.RecipientUserId.ToGuid();
        /*
        var appUser = await _unitOfWork.UsersRepository.GetByIdAsync(Guid.Parse(appUserId));
        if (appUser is null) throw new HubException("AppUser is null");
        var recipientUser =
            await _unitOfWork.UsersRepository.GetByIdAsync(Guid.Parse(request.MessageRequest.RecipientUserId));
        if (recipientUser is null) throw new HubException("Recipient is null");

        // var appUserId = userId.ToGuid();
        */

        var message = request.MessageRequest.ToEntity(appUserId, recipientUserId);

        await _unitOfWork.MessagesRepository.AddAsync(message);
        await _unitOfWork.SaveChangesAsync();

        var appUserResult = message.ToDtoList(appUserId);
        var recipientUserResult = message.ToDtoList(recipientUserId);

        await _hubContext.Clients
            .User(appUserId.ToString())
            .GetMessages(appUserResult, CancellationToken.None);

        await _hubContext.Clients
            .User(recipientUserId.ToString())
            .GetMessages(recipientUserResult, CancellationToken.None);

        _logger.LogInformation(
            "{User} Sent a Message to {Recipient}",
            appUserId,
            recipientUserId
        );

        return true;
    }
}