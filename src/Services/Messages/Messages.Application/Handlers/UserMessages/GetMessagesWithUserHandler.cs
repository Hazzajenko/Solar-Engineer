// using Infrastructure.Entities.Identity;

using ApplicationCore.Extensions;
using Mediator;
using Messages.Application.Data.UnitOfWork;
using Messages.Contracts.Responses;
using Messages.SignalR.Hubs;
using Messages.SignalR.Queries.GroupChats;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.UserMessages;

public class GetMessagesWithUserHandler : IQueryHandler<GetMessagesWithUserQuery, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<GetMessagesWithUserHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;

    public GetMessagesWithUserHandler(
        ILogger<GetMessagesWithUserHandler> logger,
        IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(GetMessagesWithUserQuery query, CancellationToken cT)
    {
        var appUserId = query.AuthUser.Id;
        var recipientUserId = query.Request.UserId.ToGuid();

        var messages = await _unitOfWork.MessagesRepository.GetUserMessagesWithUserAsync(
            appUserId,
            recipientUserId
        );

        await _hubContext.Clients
            .User(appUserId.ToString())
            .GetMessagesWithUser(
                new GetMessagesWithUserResponse
                {
                    UserId = recipientUserId.ToString(),
                    Messages = messages
                }
            );

        _logger.LogInformation("{User} GetMessages with {Recipient}", appUserId, recipientUserId);

        return true;
    }
}
