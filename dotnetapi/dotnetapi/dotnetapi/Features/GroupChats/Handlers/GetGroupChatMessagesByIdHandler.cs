using dotnetapi.Data;
using dotnetapi.Features.Messages.Entities;
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
    private readonly IServiceScopeFactory _scopeFactory;

    public GetGroupChatMessagesByIdHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<IEnumerable<GroupChatMessageDto?>>
        Handle(GetGroupChatMessagesByIdQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        return await db.GroupChatMessages
            .Where(x => x.GroupChatId == request.GroupChatId)
            .Include(x => x.Sender)
            .Include(x => x.MessageReadTimes)
            .OrderBy(x => x.MessageSentTime)
            .Select(x => x.ToDto())
            .ToListAsync(cT);
    }
}