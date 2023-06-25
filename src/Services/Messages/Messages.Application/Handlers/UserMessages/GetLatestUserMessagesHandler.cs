using Mediator;
using Messages.Application.Data.UnitOfWork;
using Messages.Contracts.Data;
using Messages.Contracts.Responses;
using Messages.SignalR.Hubs;
using Messages.SignalR.Queries.UserMessages;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.UserMessages;

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
            .GetLatestUserMessages(new GetLatestUserMessagesResponse { Messages = latestMessages });

        _logger.LogInformation("{User} Fetched Latest Messages", request.AuthUser.ToAuthUserLog());
        return latestMessages;
    }
}
