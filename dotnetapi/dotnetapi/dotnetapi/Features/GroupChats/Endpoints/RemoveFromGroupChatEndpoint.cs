using dotnetapi.Features.GroupChats.Contracts.Requests;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Handlers;
using dotnetapi.Features.GroupChats.Handlers.Delete;
using dotnetapi.Features.Users.Handlers;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.GroupChats.Endpoints;

[Authorize]
public class RemoveFromGroupChatEndpoint : Endpoint<RemoveFromGroupChatRequest>
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
        Delete("group-chats/{groupChatId:int}/users");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(RemoveFromGroupChatRequest request, CancellationToken ct)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("User is invalid");
            await SendUnauthorizedAsync(ct);
            return;
            // ThrowError("UserName is invalid");
        }

        var groupChatId = Route<int>("groupChatId");
        if (groupChatId < 0)
        {
            _logger.LogError("Invalid group chat Id {Id}", groupChatId);
            await SendNotFoundAsync(ct);
            return;
            // ThrowError("Invalid groupChatId")
        }

        ;

        // request.UserNames.A

        /*var userName = Route<string>("userName");
        if (string.IsNullOrEmpty(userName)) ThrowError("Invalid userName");*/

        if (request.UserNames.Any() is false)
            // _logger.LogError("Invalid group chat Id {Id}", groupChatId);
            ThrowError("UserNames list is empty");


        var appUserGroupChat = await _mediator.Send(new GetAppUserGroupChatQuery(appUser, groupChatId), ct);

        if (appUserGroupChat is null)
        {
            _logger.LogError("User {User} is not apart of group chat {Group}", appUser.UserName!, groupChatId);
            await SendNotFoundAsync(ct);
            return;
            // ThrowError("User is not apart of group chat");
        }

        if (appUserGroupChat.CanKick is false)
        {
            _logger.LogError("User {User} does not have kick permissions", appUser.UserName!);
            await SendUnauthorizedAsync(ct);
            return;
            // ThrowError("User does not have kick permissions");
        }

        foreach (var requestUserName in request.UserNames)
        {
            var userToRemove = await _mediator.Send(new GetUserByUserNameQuery(requestUserName), ct);

            if (userToRemove is null)
            {
                _logger.LogError("User {User} to remove does not exist", requestUserName);
                await SendNotFoundAsync(ct);
                return;
                // ThrowError("User to remove does not exist");
            }

            /*var appUserGroupChatToRemove =
                await _mediator.Send(new GetAppUserGroupChatQuery(userToRemove, groupChatId), ct);
    
            if (appUserGroupChatToRemove is null)
            {
                _logger.LogError("User {User} is not apart of group chat {Group}", userToRemove.UserName!,
                    groupChatId);
                ThrowError("User is not apart of group chat");
            }*/

            var delete =
                await _mediator.Send(new DeleteAppUserGroupChatsQuery(new List<AppUser> { userToRemove }, groupChatId),
                    ct);

            /*
            var updateMessages =
                await _mediator.Send(new UpdateMessagesByAppUserGroupChatQuery(userToRemove, groupChatId), ct);
                */

            /*if (delete is false)
            {
                _logger.LogError("User {User} is not apart of group chat {Group}", userToRemove.UserName!,
                    groupChatId);
                await SendNotFoundAsync(ct);
                return;
    
                // ThrowError("User is not apart of group chat");
            }*/
        }

        var groupChatServerMessage = new GroupChatServerMessage
        {
            GroupChat = appUserGroupChat.GroupChat,
            Content =
                $"{appUser} removed {request.UserNames.Count()} members from {appUserGroupChat.GroupChat.Name}"
        };

        var sendServerMessage = await _mediator.Send(new CreateGroupChatServerMessageQuery(groupChatServerMessage), ct);
        /*var sendSignalRMessage =
            await _mediator.Send(new SendServerMessageToGroupChatQuery(groupChatId, sendServerMessage), ct);

        if (sendSignalRMessage is false)
        {
            _logger.LogError("Group {Group} has no members to update",
                groupChatId);
            await SendNotFoundAsync(ct);
            return;
            // ThrowError("User is not apart of group chat");
        }*/

        /*var response = new RemoveFromGroupChatResponse
        {
            RemovedMembers = new List<int> { delete },
            UpdatedMessages = updateMessages
        };*/

        await SendNoContentAsync(ct);
        // await SendOkAsync(response, ct);
    }
}