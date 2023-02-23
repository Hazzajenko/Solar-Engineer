// using Infrastructure.Entities.Identity;

using Infrastructure.Extensions;
using Mediator;
using Messages.API.Data;
using Messages.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Messages.API.Handlers;

public sealed record GetMessagesWithUserQuery(HubCallerContext Context, string RecipientId)
    : IQuery<bool>;

public class GetMessagesWithUserHandler
    : IQueryHandler<GetMessagesWithUserQuery, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<GetMessagesWithUserHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;


    public GetMessagesWithUserHandler(ILogger<GetMessagesWithUserHandler> logger, IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(
        GetMessagesWithUserQuery request,
        CancellationToken cT
    )
    {
        if (request.Context.User is null) throw new HubException("Context user is null");

        var appUserId = request.Context.User.GetGuidUserId();
        var recipientUserId = request.RecipientId.ToGuid();
        /*var appUser = await _unitOfWork.UsersRepository.GetByIdAsync(Guid.Parse(userId));
        if (appUser is null) throw new HubException("AppUser is null");
        var recipient = await _unitOfWork.UsersRepository.GetByIdAsync(Guid.Parse(request.RecipientId));
        if (recipient is null) throw new HubException("Recipient is null");*/

        var messages = await _unitOfWork.MessagesRepository.GetUserMessagesWithUserAsync(appUserId, recipientUserId);

        await _hubContext.Clients
            .User(appUserId.ToString())
            .GetMessages(messages, CancellationToken.None);

        _logger.LogInformation(
            "{User} GetMessages with {Recipient}",
            appUserId,
            recipientUserId
        );

        return true;
    }
}