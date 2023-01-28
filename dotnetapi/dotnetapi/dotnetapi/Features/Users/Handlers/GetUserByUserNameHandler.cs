using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Mediator;
using MethodTimer;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers;

public sealed record GetUserByUserNameQuery(string UserName) : IRequest<AppUser?>;

[Time]
public class
    GetUserByUserNameHandler : IRequestHandler<GetUserByUserNameQuery, AppUser?>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public GetUserByUserNameHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<AppUser?>
        Handle(GetUserByUserNameQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        return await db.Users
            .Where(x => x.UserName == request.UserName)
            .SingleOrDefaultAsync(cT);
    }
}