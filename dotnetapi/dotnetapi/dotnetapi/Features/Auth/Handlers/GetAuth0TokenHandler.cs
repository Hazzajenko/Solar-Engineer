using dotnetapi.Data;
using Mediator;

namespace dotnetapi.Features.Auth.Handlers;

public sealed record GetAuth0TokenCommand : IRequest<bool>;

public class GetAuth0TokenHandler : IRequestHandler<GetAuth0TokenCommand, bool>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public GetAuth0TokenHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<bool> Handle(GetAuth0TokenCommand request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        // db.Remove(request.AppUserFriend);
        // var employer = new AppUserFriend { Id = 1 };
        // db.AppUserFriends.Entry(request.AppUserFriend).State = EntityState.Deleted;
        // db.SaveChanges();
        var response = await db.SaveChangesAsync(cT);
        return response > 0;
    }
}