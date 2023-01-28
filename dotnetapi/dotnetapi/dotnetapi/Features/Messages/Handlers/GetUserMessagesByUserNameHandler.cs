using dotnetapi.Data;
using dotnetapi.Extensions;
using dotnetapi.Features.Messages.Entities;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Messages.Handlers;

public sealed record GetUserMessagesByUserNameQuery
    (AppUser AppUser, AppUser Recipient) : IRequest<IEnumerable<MessageDto>>;

public class
    GetUserMessagesByUserNameHandler : IRequestHandler<GetUserMessagesByUserNameQuery, IEnumerable<MessageDto?>>
{
    private readonly IDataContext _context;

    public GetUserMessagesByUserNameHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<IEnumerable<MessageDto?>>
        Handle(GetUserMessagesByUserNameQuery request, CancellationToken cT)
    {
        return await _context.Messages
            .Where(m => (m.Recipient.UserName == request.AppUser.UserName && m.RecipientDeleted == false
                                                                          && m.Sender.UserName ==
                                                                          request.Recipient.UserName)
                        || (m.Recipient.UserName == request.Recipient.UserName
                            && m.Sender.UserName == request.AppUser.UserName && m.SenderDeleted == false)
            )
            .Include(x => x.Sender)
            .Include(x => x.Recipient)
            .MarkUnreadAsRead(request.AppUser.UserName!)
            .OrderBy(x => x.MessageSentTime)
            .Select(x => x.ToDto(request.AppUser))
            .ToListAsync(cT);
    }
}