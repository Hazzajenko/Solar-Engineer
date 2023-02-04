using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Messages.Handlers;

public record MarkAllGroupChatMessagesReadCommand(int GroupChatId, AppUser AppUser)
    : IRequest<bool>;

public class MarkAllGroupChatMessagesReadHandler
    : IRequestHandler<MarkAllGroupChatMessagesReadCommand, bool>
{
    private readonly IDataContext _context;

    public MarkAllGroupChatMessagesReadHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<bool> Handle(
        MarkAllGroupChatMessagesReadCommand request,
        CancellationToken cT
    )
    {
        var messages = await _context.GroupChatMessages
            .Where(x => x.GroupChatId == request.GroupChatId)
            .Include(x => x.Sender)
            .Include(x => x.MessageReadTimes)
            .ThenInclude(x => x.AppUser)
            .OrderBy(x => x.MessageSentTime)
            .ToListAsync(cT);
        
        /*
        await _context.GroupChatMessages
                
            .Where(x => x.GroupChatId == request.GroupChatId)
            .Include(x => x.MessageReadTimes)
            .SelectMany(x => x.MessageReadTimes)
            .ExecuteUpdateAsync(x => x.SetProperty(c => c.))*/


        foreach (var groupChatMessage in messages)
        {
            var readTimes = groupChatMessage.MessageReadTimes.ToList();
            var hasUserAlreadyRead = readTimes.SingleOrDefault(
                x => x.AppUserId == request.AppUser.Id
            );
            if (hasUserAlreadyRead is not null)
                continue;
            var newReadTime = new GroupChatReadTime
            {
                AppUser = request.AppUser,
                GroupChatMessage = groupChatMessage,
                MessageReadTime = DateTime.Now
            };

            await _context.GroupChatReadTimes.AddAsync(newReadTime, cT);
        }

        return await _context.SaveChangesAsync(cT) > 0;
    }
}