using Mediator;
using Messages.Application.Data.UnitOfWork;
using Messages.Contracts.Data;
using Messages.Contracts.Responses;
using Messages.SignalR.Hubs;
using Messages.SignalR.Queries.GroupChats;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.GroupChats;

public class GetLatestGroupChatMessagesHandler
    : IQueryHandler<GetLatestGroupChatMessagesQuery, IEnumerable<GroupChatDto>>
{
    private readonly IMessagesUnitOfWork _unitOfWork;
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<GetLatestGroupChatMessagesHandler> _logger;

    public GetLatestGroupChatMessagesHandler(
        IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext,
        ILogger<GetLatestGroupChatMessagesHandler> logger
    )
    {
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _logger = logger;
    }

    public async ValueTask<IEnumerable<GroupChatDto>> Handle(
        GetLatestGroupChatMessagesQuery query,
        CancellationToken cT
    )
    {
        var latestGroupChatMessages =
            await _unitOfWork.AppUserGroupChatsRepository.GetLatestGroupChatMessagesAsync(
                query.AuthUser.Id
            );

        await _hubContext.Clients
            .User(query.AuthUser.Id.ToString())
            .GetLatestGroupChatMessages(
                new GetLatestGroupChatMessagesResponse { GroupChats = latestGroupChatMessages }
            );

        _logger.LogInformation(
            "{User} Fetched Latest Group Chat Messages",
            query.AuthUser.ToAuthUserLog()
        );

        return latestGroupChatMessages;
    }
}
