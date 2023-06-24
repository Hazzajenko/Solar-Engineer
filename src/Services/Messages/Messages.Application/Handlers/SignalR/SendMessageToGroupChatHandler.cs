using Infrastructure.Extensions;
using Mediator;
using Messages.Application.Data;
using Messages.Application.Data.UnitOfWork;
using Messages.Application.Mapping;
using Messages.SignalR.Commands.GroupChats;
using Messages.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.SignalR;

public class SendMessageToGroupChatHandler : IQueryHandler<SendMessageToGroupChatCommand, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<SendMessageToGroupChatHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;

    public SendMessageToGroupChatHandler(
        ILogger<SendMessageToGroupChatHandler> logger,
        IMessagesUnitOfWork unitOfWork,
        IHubContext<MessagesHub, IMessagesHub> hubContext
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(SendMessageToGroupChatCommand command, CancellationToken cT)
    {
        var appUserId = command.AuthUser.Id;

        var groupChat = await _unitOfWork.GroupChatsRepository.GetByIdAsync(
            command.GroupChatMessageRequest.GroupChatId.ToGuid()
        );
        if (groupChat is null)
        {
            _logger.LogError("Bad request, GroupChat is invalid");
            throw new HubException("Bad request, GroupChat is invalid");
        }

        var groupChatMessage = command.GroupChatMessageRequest.ToEntity(appUserId, groupChat);

        await _unitOfWork.GroupChatMessagesRepository.AddAsync(groupChatMessage);

        var appUserMessage = groupChatMessage.ToCombinedDtoList(appUserId);
        var otherUsersMessage = groupChatMessage.ToOtherUsersCombinedDtoList();

        var groupChatMemberIds =
            await _unitOfWork.AppUserGroupChatsRepository.GetGroupChatMemberIdsAsync(
                groupChat.Id,
                appUserId
            );

        await _hubContext.Clients.User(appUserId.ToString()).GetGroupChatMessages(appUserMessage);
        await _hubContext.Clients.Users(groupChatMemberIds).GetGroupChatMessages(otherUsersMessage);

        _logger.LogInformation("{User} Sent a Message To Group {Group}", appUserId, groupChat.Id);

        return true;
    }
}
