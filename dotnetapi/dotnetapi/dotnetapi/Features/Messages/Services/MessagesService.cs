using dotnetapi.Features.Messages.Entities;
using dotnetapi.Hubs;
using dotnetapi.Models.Entities;
using Microsoft.AspNetCore.SignalR;

namespace dotnetapi.Features.Messages.Services;

public interface IMessagesService
{
    Task<bool> SendMessageToUserAsync(AppUser recipient, MessageDto message);
}

public class MessagesService : IMessagesService
{
    private readonly IHubContext<MessagesHub> _hubContext;

    public MessagesService(
        IHubContext<MessagesHub> hubContext)
    {
        _hubContext = hubContext;
    }

    public async Task<bool> SendMessageToUserAsync(AppUser recipient, MessageDto message)
    {
        await _hubContext.Clients.User(recipient.UserName!)
            .SendAsync("GetMessages", message);

        return true;
    }
}