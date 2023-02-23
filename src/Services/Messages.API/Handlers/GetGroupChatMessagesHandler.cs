using Infrastructure.Extensions;
using Mediator;
using Messages.API.Data;
using Messages.API.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Messages.API.Handlers;

public sealed record GetGroupChatMessagesQuery
    (HubCallerContext Context, string GroupChatId) : IRequest<bool>;

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
        Handle(GetGroupChatMessagesQuery request, CancellationToken cT)
    {
        if (request.Context.User is null) throw new HubException("Context user is null");

        var appUserId = request.Context.User.GetGuidUserId();
        /*var appUser = await _unitOfWork.UsersRepository.GetByIdAsync(Guid.Parse(userId));
        if (appUser is null) throw new HubException("AppUser is null");*/

        var groupChatMessages = await _unitOfWork.GroupChatMessagesRepository.GetGroupChatMessagesAsync(appUserId,
            request.GroupChatId.ToGuid());

        await _hubContext.Clients
            .User(appUserId.ToString())
            .GetGroupChatMessages(groupChatMessages, CancellationToken.None);

        var groupChatServerMessages =
            await _unitOfWork.GroupChatServerMessagesRepository.GetGroupChatServerMessagesAsync(
                request.GroupChatId.ToGuid());

        await _hubContext.Clients
            .User(appUserId.ToString())
            .GetGroupChatServerMessages(groupChatServerMessages, CancellationToken.None);

        _logger.LogInformation(
            "{User} GetGroupChatMessages with GroupChat {Recipient}",
            appUserId,
            request.GroupChatId
        );

        return true;
    }
}