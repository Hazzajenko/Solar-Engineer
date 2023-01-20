using dotnetapi.Extensions;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Hubs;

public interface IMessagesHub
{
    Task GetNewMessage(MessageDto message);
}

public class MessagesHub : Hub
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IMessagesRepository _messagesRepository;
    private readonly ILogger<MessagesHub> _logger;

    public MessagesHub(UserManager<AppUser> userManager, IMessagesRepository messagesRepository, ILogger<MessagesHub> logger)
    {
        _userManager = userManager;
        _messagesRepository = messagesRepository;
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        /*var username = Context.User!.GetUsername();
        var connectionId = Context.ConnectionId;
        var httpContext = Context.GetHttpContext();
        var otherUser = httpContext!.Request.Query["user"].ToString();
        var groupName = GetGroupName(username, otherUser);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        var group = await AddToGroup(groupName);
        await Clients.Group(groupName).SendAsync("UpdatedGroup", group);*/

        /*var messages = await _unitOfWork.MessageRepository.
            GetMessageThread(Context.User.GetUsername(), otherUser);*/

        // if (_unitOfWork.HasChanges()) await _unitOfWork.Complete();

        // await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        /*var group = await RemoveFromMessageGroup();
        await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
        await base.OnDisconnectedAsync(exception);*/
    }

    /*public async Task GetMessages(MessageDto message)
    {
        // await Clients.Client(connectionId).SendAsync("GetNotifications", "data");
        // await Clients.User("hazza").SendAsync("GetNotifications", "datasdasa");
        // await Clients.Client(connectionId).("GetNotifications", "data");
    }*/

    public async Task GetMessages(string username)
    {
        var appUser = await _userManager.Users.Where(x => x.UserName == Context.User!.GetUsername()).SingleOrDefaultAsync();
        if (appUser is null)
        {
            throw new HubException("appUser is null");
        }
        var recipient = await _userManager.Users.Where(x => x.UserName == username).SingleOrDefaultAsync();
        if (recipient is null)
        {
            throw new HubException("recipient is null");
        }

        _logger.LogInformation("{User} GetMessages with {Recipient}", appUser.UserName!, recipient.UserName!);
        var messages = await _messagesRepository.GetUserConversationAsync(appUser, recipient);
        await Clients.Caller.SendAsync("GetMessages", messages);
    }


    public string GetConnectionId()
    {
        return Context.ConnectionId;
    }

    /*
    public async Task SendMessageToUser(MessageDtoDeprecated messageDtoDeprecated)
    {
    }
    */

    public async Task SendMessage(MessageDtoDeprecated messageDtoDeprecated)
    {
        // var user = Context.User!;
        var username = Context.User!.GetUsername();

        if (username == messageDtoDeprecated.RecipientUsername.ToLower())
            throw new HubException("You cannot send messages to yourself");

        // var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
        var sender = await _userManager.Users.Where(x => x.UserName == username)
            .SingleOrDefaultAsync();
        if (sender is null) throw new HubException("Not found user");
        var recipient = await _userManager.Users.Where(x => x.UserName == messageDtoDeprecated.RecipientUsername)
            .SingleOrDefaultAsync();
        /*if (recipient is null)
        {
            return;
        }*/

        if (recipient is null) throw new HubException("Not found user");

        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName!,
            RecipientUsername = recipient.UserName!,
            Content = messageDtoDeprecated.Content
        };

        var groupName = GetGroupName(sender.UserName!, recipient.UserName!);

        /*var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);

        if (group.Connections.Any(x => x.Username == recipient.UserName))
        {
            message.DateRead = DateTime.UtcNow;
        }
        else
        {
            var connections = await _tracker.GetConnectionsForUser(recipient.UserName);
            if (connections != null)
                await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                    new { username = sender.UserName, knownAs = sender.KnownAs });
        }

        _unitOfWork.MessageRepository.AddMessage(message);

        if (await _unitOfWork.Complete())
            await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));*/
    }

    private async Task<Group> AddToGroup(string groupName)
    {
        /*var group = await _unitOfWork.MessageRepository.GetMessageGroup(groupName);
        var connection = new DbLoggerCategory.Database.Connection(Context.ConnectionId, Context.User.GetUsername());

        if (group == null)
        {
            group = new Group(groupName);
            _unitOfWork.MessageRepository.AddGroup(group);
        }

        group.Connections.Add(connection);

        if (await _unitOfWork.Complete()) return group;*/

        throw new HubException("Failed to join group");
    }

    private async Task<Group> RemoveFromMessageGroup()
    {
        /*var group = await _unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
        var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
        _unitOfWork.MessageRepository.RemoveConnection(connection);
        if (await _unitOfWork.Complete()) return group;*/

        throw new HubException("Failed to remove from group");
    }

    private string GetGroupName(string caller, string other)
    {
        var stringCompare = string.CompareOrdinal(caller, other) < 0;
        return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
    }
}