using dotnetapi.Extensions;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Hubs;

public class MessagesHub : Hub
{
    private readonly UserManager<AppUser> _userManager;

    public MessagesHub(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public override async Task OnConnectedAsync()
    {
        var username = Context.User!.GetUsername();
        var connectionId = Context.ConnectionId;
        var httpContext = Context.GetHttpContext();
        var otherUser = httpContext!.Request.Query["user"].ToString();
        var groupName = GetGroupName(username, otherUser);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        var group = await AddToGroup(groupName);
        await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

        /*var messages = await _unitOfWork.MessageRepository.
            GetMessageThread(Context.User.GetUsername(), otherUser);*/

        // if (_unitOfWork.HasChanges()) await _unitOfWork.Complete();

        // await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        var group = await RemoveFromMessageGroup();
        await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
        await base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(MessageDto messageDto)
    {
        // var user = Context.User!;
        var username = Context.User!.GetUsername();

        if (username == messageDto.RecipientUsername.ToLower())
            throw new HubException("You cannot send messages to yourself");

        // var sender = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
        var sender = await _userManager.Users.Where(x => x.UserName == username)
            .SingleOrDefaultAsync();
        if (sender is null) throw new HubException("Not found user");
        var recipient = await _userManager.Users.Where(x => x.UserName == messageDto.RecipientUsername)
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
            Content = messageDto.Content
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