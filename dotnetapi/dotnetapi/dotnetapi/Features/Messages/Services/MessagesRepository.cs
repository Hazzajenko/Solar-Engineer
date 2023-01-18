using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Messages.Services;

public interface IMessagesRepository
{
    Task<Message> AddMessageAsync(Message message);
    Task<IEnumerable<Message>> GetMessagesAsync(AppUser appUser);
    Task<bool> RemoveMessage(Message message);
}

public class MessagesRepository : IMessagesRepository
{
    private readonly DataContext _context;

    public MessagesRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Message> AddMessageAsync(Message message)
    {
        await _context.Messages.AddAsync(message);
        await _context.SaveChangesAsync();
        return message;
    }

    public async Task<IEnumerable<Message>> GetMessagesAsync(AppUser appUser)
    {
        var messagesSent = await _context.Messages
            .Where(x => x.SenderUsername == appUser.UserName!)
            .Include(x => x.Recipient)
            .ToListAsync();

        var messagesReceived = await _context.Messages
            .Where(x => x.RecipientUsername == appUser.UserName!)
            .Include(x => x.Sender)
            .ToListAsync();

        messagesSent.AddRange(messagesReceived);
        return messagesSent;
    }

    public async Task<bool> RemoveMessage(Message message)
    {
        _context.Messages.Remove(message);
        await _context.SaveChangesAsync();
        return true;
    }
}