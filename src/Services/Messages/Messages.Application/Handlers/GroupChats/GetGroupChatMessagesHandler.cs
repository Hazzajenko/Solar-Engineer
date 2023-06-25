using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Mediator;
using Messages.Application.Data.UnitOfWork;
using Messages.Contracts.Responses;
using Messages.SignalR.Hubs;
using Messages.SignalR.Queries.GroupChats;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.GroupChats;

public class GetGroupChatMessagesHandler : IRequestHandler<GetGroupChatMessagesQuery, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<GetGroupChatMessagesHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;

    public GetGroupChatMessagesHandler(
        IHubContext<MessagesHub, IMessagesHub> hubContext,
        ILogger<GetGroupChatMessagesHandler> logger,
        IMessagesUnitOfWork unitOfWork
    )
    {
        _hubContext = hubContext;
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<bool> Handle(GetGroupChatMessagesQuery query, CancellationToken cT)
    {
        var appUserId = query.AuthUser.Id;
        var groupChatId = query.Request.GroupChatId.ToGuid();

        var groupChatMessages =
            await _unitOfWork.GroupChatMessagesRepository.GetGroupChatMessagesAsync(
                appUserId,
                groupChatId
            );

        await _hubContext.Clients
            .User(appUserId.ToString())
            .GetGroupChatMessages(
                new GetGroupChatMessagesResponse { GroupChatMessages = groupChatMessages }
            );

        _logger.LogInformation(
            "{User} GetGroupChatMessages with GroupChat {Recipient}",
            appUserId,
            groupChatId
        );

        return true;
    }
}
