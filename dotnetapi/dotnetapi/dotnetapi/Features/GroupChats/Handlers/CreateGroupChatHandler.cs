using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using Mediator;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record CreateGroupChatQuery(AppUserGroupChat AppUserGroupChat) : IRequest<AppUserGroupChat>;

public class CreateGroupChatHandler : IRequestHandler<CreateGroupChatQuery, AppUserGroupChat>
{
    private readonly IDataContext _context;

    public CreateGroupChatHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<AppUserGroupChat>
        Handle(CreateGroupChatQuery request, CancellationToken cT)
    {
        await _context.AppUserGroupChats.AddAsync(request.AppUserGroupChat, cT);
        await _context.SaveChangesAsync(cT);
        return request.AppUserGroupChat;
    }
}