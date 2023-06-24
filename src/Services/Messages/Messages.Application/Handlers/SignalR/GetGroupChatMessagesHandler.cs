using Infrastructure.Extensions;
using Mediator;
using Messages.Application.Data;
using Messages.Application.Data.UnitOfWork;
using Messages.SignalR.Hubs;
using Messages.SignalR.Queries.GroupChats;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.SignalR;



public class
    GetGroupChatMessagesHandler : IRequestHandler<GetGroupChatMessagesQuery, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<GetGroupChatMessagesHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;

    public GetGroupChatMessagesHandler(IHubContext<MessagesHub, IMessagesHub> hubContext,
        ILogger<GetGroupChatMessagesHandler> logger, IMessagesUnitOfWork unitOfWork)
    {
        _hubContext = hubContext;
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool>
        Handle(GetGroupChatMessagesQuery query, CancellationToken cT)
    {
        var appUserId = query.AuthUser.Id;

        var groupChatMessages = await _unitOfWork.GroupChatMessagesRepository.GetGroupChatMessagesAsync(appUserId,
            query.GroupChatId.ToGuid());

        await _hubContext.Clients
            .User(appUserId.ToString())
            .GetGroupChatMessages(groupChatMessages);

        _logger.LogInformation(
            "{User} GetGroupChatMessages with GroupChat {Recipient}",
            appUserId,
            query.GroupChatId
        );

        return true;
    }
}