using Mediator;
using Messages.Application.Data.UnitOfWork;
using Messages.Application.Handlers.GroupChats;
using Messages.Contracts.Data;
using Messages.Contracts.Responses;
using Messages.SignalR.Hubs;
using Messages.SignalR.Queries.Messages;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.Messages;

public class GetLatestUserMessagesHandler
    : IQueryHandler<GetLatestUserMessagesQuery, IEnumerable<LatestUserMessageDto>>
{
    private readonly IMessagesUnitOfWork _unitOfWork;
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<GetLatestUserMessagesHandler> _logger;

    public GetLatestUserMessagesHandler(
        IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext,
        ILogger<GetLatestUserMessagesHandler> logger
    )
    {
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
        _logger = logger;
    }

    public async ValueTask<IEnumerable<LatestUserMessageDto>> Handle(
        GetLatestUserMessagesQuery request,
        CancellationToken cT
    )
    {
        var latestMessages = await _unitOfWork.MessagesRepository.GetLatestUserMessagesAsync(
            request.AuthUser.Id
        );
        await _hubContext.Clients
            .User(request.AuthUser.Id.ToString())
            .GetLatestMessages(new GetLatestMessagesResponse { Messages = latestMessages });

        _logger.LogInformation("{User} Fetched Latest Messages", request.AuthUser.ToAuthUserLog());
        return latestMessages;
    }
}
