using IdentityModel;
using Mediator;
using Messages.API.Contracts.Data;
using Messages.API.Data;

namespace Messages.API.Handlers;

public sealed record GetLatestUserMessagesQuery(Principal User) : IRequest<IEnumerable<LatestUserMessageDto>>;

public class
    GetLatestUserMessagesHandler : IRequestHandler<GetLatestUserMessagesQuery, IEnumerable<LatestUserMessageDto>>
{
    private readonly IMessagesUnitOfWork _unitOfWork;

    public GetLatestUserMessagesHandler(IMessagesUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async ValueTask<IEnumerable<LatestUserMessageDto>>
        Handle(GetLatestUserMessagesQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        return await db.Messages
            .Where(x => x.SenderUserName == request.AppUser.UserName! ||
                        x.RecipientUserName == request.AppUser.UserName!)
            .Include(x => x.Sender)
            .Include(x => x.Recipient)
            // .OrderBy(x => x.MessageSentTime)
            .GroupBy(x => x.Sender.UserName == request.AppUser.UserName ? x.Recipient.UserName : x.Sender.UserName)

            // .OrderBy(x => x.Select(x => x.MessageSentTime))
            .Select(x => new LatestUserMessageDto
            {
                UserName = x.Key!,
                Message = x.OrderByDescending(o => o.MessageSentTime)
                    .Select(y => y.ToDto(request.AppUser))
                    .SingleOrDefault()
            })
            .ToListAsync(cT);
    }
}