using Infrastructure.Extensions;
using Mediator;
using Messages.API.Contracts.Requests;
using Messages.API.Data;
using Messages.API.Hubs;
using Messages.API.Mapping;
using Microsoft.AspNetCore.SignalR;

namespace Messages.API.Handlers;

public sealed record SendMessageToGroupChatCommand(HubCallerContext Context,
        SendGroupChatMessageRequest GroupChatMessageRequest)
    : IQuery<bool>;

public class SendMessageToGroupChatHandler
    : IQueryHandler<SendMessageToGroupChatCommand, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<SendMessageToGroupChatHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;


    public SendMessageToGroupChatHandler(ILogger<SendMessageToGroupChatHandler> logger, IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(
        SendMessageToGroupChatCommand request,
        CancellationToken cT
    )
    {
        if (request.Context.User is null) throw new HubException("Context user is null");

        var userId = request.Context.User.GetUserId();
        var appUser = await _unitOfWork.UsersRepository.GetByIdAsync(Guid.Parse(userId));
        if (appUser is null)
        {
            _logger.LogError("Bad request, AppUser is invalid");
            throw new HubException("Bad request, AppUser is invalid");
        }

        ;

        var groupChat =
            await _unitOfWork.GroupChatsRepository.GetByIdAsync(request.GroupChatMessageRequest.GroupChatId.ToGuid());
        if (groupChat is null)
        {
            _logger.LogError("Bad request, GroupChat is invalid");
            throw new HubException("Bad request, GroupChat is invalid");
        }

        var groupChatMessage = request.GroupChatMessageRequest.ToEntity(appUser, groupChat);

        await _unitOfWork.GroupChatMessagesRepository.AddAsync(groupChatMessage);

        var appUserMessage = groupChatMessage.ToDtoList(appUser);
        var otherUsersMessage = groupChatMessage.ToOtherUsersDtoList();

        var groupChatMemberIds =
            await _unitOfWork.UserGroupChatsRepository.GetGroupChatMemberIdsAsync(groupChat.Id, appUser);

        await _hubContext.Clients
            .User(appUser.Id.ToString())
            .GetGroupChatMessages(appUserMessage, CancellationToken.None);
        await _hubContext.Clients
            .Users(groupChatMemberIds)
            .GetGroupChatMessages(otherUsersMessage, CancellationToken.None);


        _logger.LogInformation(
            "{User} Sent a Message To Group {Group}",
            appUser.Id,
            groupChat.Id
        );

        return true;
    }
}