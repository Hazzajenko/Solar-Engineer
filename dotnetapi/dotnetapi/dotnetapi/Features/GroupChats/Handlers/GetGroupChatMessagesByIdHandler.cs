using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record GetGroupChatMessagesByIdQuery
    (AppUser AppUser, int GroupChatId) : IRequest<IEnumerable<GroupChatMessageDto>>;

public class
    GetGroupChatMessagesByIdHandler : IRequestHandler<GetGroupChatMessagesByIdQuery, IEnumerable<GroupChatMessageDto?>>
{
    private readonly IDataContext _context;

    public GetGroupChatMessagesByIdHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<GroupChatMessageDto?>>
        Handle(GetGroupChatMessagesByIdQuery request, CancellationToken cT)
    {


        return await _context.GroupChatMessages
            .Where(x => x.GroupChatId == request.GroupChatId)
            .Include(x => x.Sender)
            .Include(x => x.MessageReadTimes)
            .ThenInclude(x => x.AppUser)
            .OrderBy(x => x.MessageSentTime)
            .Select(x => x.ToDto(request.AppUser))
            .ToListAsync(cT);

        // var newReadTimes = new List<GroupChatReadTime>();

        /*
        foreach (var message in groupChatMessages)
        {
            // var messageMessageReadTimes = message.MessageReadTimes.ToList();

            var newReadTime = new GroupChatReadTime
            {
                AppUser = request.AppUser,
                GroupChatMessage = message,
                MessageReadTime = DateTime.Now
            };
            // newReadTimes.Add(newReadTime);
            await db.GroupChatReadTimes.AddAsync(newReadTime, cT);
        }

        // await db.AddRangeAsync(newReadTimes, cT);
        await db.SaveChangesAsync(cT);
        return groupChatMessages.Select(x => x.ToDto(request.AppUser));*/
    }
}