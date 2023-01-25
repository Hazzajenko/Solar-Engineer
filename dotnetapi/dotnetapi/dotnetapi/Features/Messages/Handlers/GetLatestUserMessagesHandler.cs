using dotnetapi.Data;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Messages.Handlers;

public sealed record GetLatestUserMessagesQuery(AppUser AppUser) : IRequest<IEnumerable<LatestUserMessageDto>>;

public class
    GetLatestUserMessagesHandler : IRequestHandler<GetLatestUserMessagesQuery, IEnumerable<LatestUserMessageDto>>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public GetLatestUserMessagesHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<IEnumerable<LatestUserMessageDto>>
        Handle(GetLatestUserMessagesQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        return await db.Messages
            .Where(x => x.SenderUsername == request.AppUser.UserName! ||
                        x.RecipientUsername == request.AppUser.UserName!)
            .Include(x => x.Sender)
            .Include(x => x.Recipient)
            // .OrderBy(x => x.MessageSentTime)
            .GroupBy(x => x.Sender.UserName == request.AppUser.UserName ? x.Recipient.UserName : x.Sender.UserName)

            // .OrderBy(x => x.Select(x => x.MessageSentTime))
            .Select(x => new LatestUserMessageDto
            {
                Username = x.Key!,
                Message = x.OrderByDescending(o => o.MessageSentTime)
                    .Select(y => y.ToDto())
                    .SingleOrDefault()
            })
            .ToListAsync(cT);
    }
}