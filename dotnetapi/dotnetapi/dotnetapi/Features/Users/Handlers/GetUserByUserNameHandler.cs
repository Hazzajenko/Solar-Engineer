using dotnetapi.Data;
using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Mapping;
using Mediator;
using MethodTimer;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers;

public sealed record GetUserByUserNameQuery(string UserName) : IRequest<GetUserDto?>;

[Time]
public class
    GetUserByUserNameHandler : IRequestHandler<GetUserByUserNameQuery, GetUserDto?>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public GetUserByUserNameHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<GetUserDto?>
        Handle(GetUserByUserNameQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        return await db.Users
            .Where(x => x.UserName == request.UserName)
            .Select(x => x.ToGetUserDto())
            .SingleOrDefaultAsync(cT);
    }
}