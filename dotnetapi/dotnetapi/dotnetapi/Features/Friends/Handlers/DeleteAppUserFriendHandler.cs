using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Friends.Handlers;

public sealed record DeleteAppUserFriendQuery
    (AppUserFriend AppUserFriend) : IRequest<bool>;

public class
    DeleteAppUserFriendHandler : IRequestHandler<DeleteAppUserFriendQuery, bool>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public DeleteAppUserFriendHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<bool>
        Handle(DeleteAppUserFriendQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        // db.Remove(request.AppUserFriend);
        // var employer = new AppUserFriend { Id = 1 };
        db.AppUserFriends.Entry(request.AppUserFriend).State = EntityState.Deleted;
        // db.SaveChanges();
        var response = await db.SaveChangesAsync(cT);
        return response > 0;
    }
}