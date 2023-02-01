using dotnetapi.Data;
using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Mapping;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers;

public record GetUserDtoByUserNameQuery(string UserName) : IRequest<GetUserDto?>;

// [Time]
public class
    GetUserDtoByUserNameHandler : IRequestHandler<GetUserDtoByUserNameQuery, GetUserDto?>
{
    private readonly IServiceScopeFactory _scopeFactory;

    public GetUserDtoByUserNameHandler(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async ValueTask<GetUserDto?>
        Handle(GetUserDtoByUserNameQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        return await db.Users
            .Where(x => x.UserName == request.UserName)
            // .Include(x => x.)
            .Select(x => x.ToGetUserDto())
            .SingleOrDefaultAsync(cT);
    }
}