using Mediator;
using Messages.Application.Data.UnitOfWork;
using Messages.Contracts.Data;
using Messages.Contracts.Responses;
using Messages.SignalR.Hubs;
using Messages.SignalR.Queries.GroupChats;
using Messages.SignalR.Queries.Messages;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.Messages;

public class GetLatestMessagesHandler
    : IQueryHandler<GetLatestMessagesQuery, IEnumerable<MessagePreviewDto>>
{
    private readonly IMessagesUnitOfWork _unitOfWork;
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<GetLatestMessagesHandler> _logger;

    public GetLatestMessagesHandler(
        IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext,
        ILogger<GetLatestMessagesHandler> logger
    )
    {
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _logger = logger;
    }

    public async ValueTask<IEnumerable<MessagePreviewDto>> Handle(
        GetLatestMessagesQuery query,
        CancellationToken cT
    )
    {
        var latestGroupChatMessages =
            await _unitOfWork.AppUserGroupChatsRepository.GetLatestGroupChatMessagesAsPreviewAsync(
                query.AuthUser.Id
            );

        var latestUserMessages =
            await _unitOfWork.MessagesRepository.GetLatestUserMessagesAsPreviewAsync(
                query.AuthUser.Id
            );

        var latestMessages = latestGroupChatMessages.Concat(latestUserMessages);

        await _hubContext.Clients
            .User(query.AuthUser.Id.ToString())
            .GetLatestMessages(new GetLatestMessagesResponse { Messages = latestMessages });

        _logger.LogInformation("{User} Fetched Latest Messages", query.AuthUser.ToAuthUserLog());

        return latestGroupChatMessages;
    }
}
