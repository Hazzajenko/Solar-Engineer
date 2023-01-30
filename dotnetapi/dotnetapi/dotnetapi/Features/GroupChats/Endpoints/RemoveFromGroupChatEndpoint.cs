using dotnetapi.Features.GroupChats.Contracts.Requests;
using dotnetapi.Features.GroupChats.Contracts.Responses;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Handlers;
using dotnetapi.Features.GroupChats.Handlers.Delete;
using dotnetapi.Features.GroupChats.Handlers.SignalR;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.GroupChats.Endpoints;

[Authorize]
public class RemoveFromGroupChatEndpoint : Endpoint<RemoveFromGroupChatRequest, RemoveFromGroupChatResponse>
{
    private readonly ILogger<RemoveFromGroupChatEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public RemoveFromGroupChatEndpoint(
        ILogger<RemoveFromGroupChatEndpoint> logger,
        IMediator mediator,
        UserManager<AppUser> userManager)
    {
        _logger = logger;

        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Delete("group-chats/{groupChatId:int}/users/{userName}");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(RemoveFromGroupChatRequest request, CancellationToken ct)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var groupChatId = Route<int>("groupChatId");
        if (groupChatId < 0) ThrowError("Invalid groupChatId");
        
        // request.UserNames.A

        var userName = Route<string>("userName");
        if (string.IsNullOrEmpty(userName)) ThrowError("Invalid userName");


        var appUserGroupChat = await _mediator.Send(new GetAppUserGroupChatQuery(appUser, groupChatId), ct);
        
        if (appUserGroupChat is null)
        {
            _logger.LogError("User {User} is not apart of group chat {Group}", appUser.UserName!, groupChatId);
            ThrowError("User is not apart of group chat");
        }

        if (appUserGroupChat.CanKick is false)
        {
            _logger.LogError("User {User} does not have kick permissions", appUser.UserName!);
            ThrowError("User does not have kick permissions");
        }

        var userToRemove = await _mediator.Send(new GetUserByUserNameQuery(userName), ct);

        if (userToRemove is null)
        {
            _logger.LogError("User {User} to remove does not exist", userName);
            ThrowError("User to remove does not exist");
        }

        var appUserGroupChatToRemove =
            await _mediator.Send(new GetAppUserGroupChatQuery(userToRemove, groupChatId), ct);

        if (appUserGroupChatToRemove is null)
        {
            _logger.LogError("User {User} is not apart of group chat {Group}", userToRemove.UserName!,
                groupChatId);
            ThrowError("User is not apart of group chat");
        }

        var delete = await _mediator.Send(new DeleteAppUserGroupChatQuery(appUserGroupChatToRemove), ct);

        var groupChatServerMessage = new GroupChatServerMessage
        {
            GroupChat = appUserGroupChat.GroupChat,
            Content =
                $"{appUser} removed {userName} from {appUserGroupChat.GroupChat.Name}"
        };

        var sendServerMessage = await _mediator.Send(new CreateGroupChatServerMessageQuery(groupChatServerMessage), ct);
        var sendSignalRMessage =
            await _mediator.Send(new SendSignalRMessageToGroupChatQuery(groupChatId, sendServerMessage), ct);


        var response = new RemoveFromGroupChatResponse
        {
            Removed = new List<int> { delete }
        };

        await SendOkAsync(response, ct);
    }
}