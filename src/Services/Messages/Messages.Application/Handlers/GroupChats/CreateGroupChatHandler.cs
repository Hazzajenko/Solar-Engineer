using System.Security.Claims;
using Infrastructure.Extensions;
using Mediator;
using Messages.Application.Data.UnitOfWork;
using Messages.Application.Mapping;
using Messages.Contracts.Requests;
using Messages.Domain.Entities;
using Messages.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR;

namespace Messages.Application.Handlers.GroupChats;

public sealed record CreateGroupChatCommand(
    ClaimsPrincipal User,
    CreateGroupChatRequest CreateGroupChatRequest
) : IRequest<bool>;

public class CreateGroupChatHandler : IRequestHandler<CreateGroupChatCommand, bool>
{
    private readonly IHubContext<MessagesHub, IMessagesHub> _hubContext;
    private readonly ILogger<CreateGroupChatHandler> _logger;
    private readonly IMessagesUnitOfWork _unitOfWork;

    public CreateGroupChatHandler(
        IMessagesUnitOfWork unitOfWork,
        ILogger<CreateGroupChatHandler> logger,
        IHubContext<MessagesHub, IMessagesHub> hubContext
    )
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _hubContext = hubContext;
    }

    public async ValueTask<bool> Handle(CreateGroupChatCommand request, CancellationToken cT)
    {
        var appUserId = request.User.GetGuidUserId();
        var appUserGroupChat = request.CreateGroupChatRequest.ToDomain(appUserId);
        await _unitOfWork.AppUserGroupChatsRepository.AddAsync(appUserGroupChat);
        await _unitOfWork.SaveChangesAsync();
        var groupChatId = appUserGroupChat.GroupChatId;

        var newGroupChatMembers = new List<AppUserGroupChat>();
        if (request.CreateGroupChatRequest.Invites.Any())
        {
            foreach (var requestInvite in request.CreateGroupChatRequest.Invites)
            {
                var invitedUserId = requestInvite.UserId.ToGuid();
                var isAppUserGroupChatExisting =
                    await _unitOfWork.AppUserGroupChatsRepository.GetByAppUserAndGroupChatIdAsync(
                        invitedUserId,
                        groupChatId
                    );

                if (isAppUserGroupChatExisting is not null)
                {
                    _logger.LogError(
                        "User {Recipient} is already in group chat",
                        requestInvite.UserId
                    );
                    throw new HubException($"User {requestInvite.UserId} is already in group chat");
                }

                var invitedUserAppUserGroupChat = new AppUserGroupChat
                {
                    GroupChat = appUserGroupChat.GroupChat,
                    Role = requestInvite.Role,
                    CanInvite = true,
                    CanKick = true,
                    AppUserId = invitedUserId
                };
                newGroupChatMembers.Add(invitedUserAppUserGroupChat);
            }

            await _unitOfWork.AppUserGroupChatsRepository.AddRangeAsync(newGroupChatMembers);
            await _unitOfWork.SaveChangesAsync();
            var invitedUserIds = newGroupChatMembers.Select(x => x.AppUserId.ToString());
            var memberIds =
                await _unitOfWork.AppUserGroupChatsRepository.GetGroupChatMemberIdsAsync(
                    groupChatId
                );
            var existingMemberIds = memberIds.Where(x => invitedUserIds.Contains(x) is false);

            var groupChatServerMessage = new GroupChatServerMessage
            {
                GroupChat = appUserGroupChat.GroupChat,
                Content = $"{appUserId} created {appUserGroupChat.GroupChat.Name}"
            };

            var serverMessages = groupChatServerMessage.ToCombinedDtoList();

            await _hubContext.Clients.Users(existingMemberIds).GetGroupChatMessages(serverMessages);
        }

        return true;

        // await _unitOfWork.SaveChangesAsync();
        // return await _unitOfWork.UserGroupChatsRepository.GetLatestGroupChatMessagesAsync(request.User.GetGuidUserId());
    }
}
