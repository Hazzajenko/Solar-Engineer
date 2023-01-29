using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using Mediator;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record CreateAppUserGroupChatQuery(AppUserGroupChat AppUserGroupChat) : IRequest<AppUserGroupChat>;

public class CreateAppUserGroupChatHandler : IRequestHandler<CreateAppUserGroupChatQuery, AppUserGroupChat>
{
    private readonly IDataContext _context;

    public CreateAppUserGroupChatHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<AppUserGroupChat>
        Handle(CreateAppUserGroupChatQuery request, CancellationToken cT)
    {
        await _context.AppUserGroupChats.AddAsync(request.AppUserGroupChat, cT);
        await _context.SaveChangesAsync(cT);
        return request.AppUserGroupChat;
    }
}