using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers.Delete;

public sealed record DeleteAppUserGroupChatQuery(AppUserGroupChat AppUserGroupChat) : IRequest<int>;

public class DeleteAppUserGroupChatHandler : IRequestHandler<DeleteAppUserGroupChatQuery, int>
{
    private readonly IDataContext _context;

    public DeleteAppUserGroupChatHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<int>
        Handle(DeleteAppUserGroupChatQuery request, CancellationToken cT)
    {
        _context.AppUserGroupChats.Entry(request.AppUserGroupChat).State = EntityState.Deleted;
        var removed = await _context.SaveChangesAsync(cT);
        return request.AppUserGroupChat.AppUserId;
    }
}