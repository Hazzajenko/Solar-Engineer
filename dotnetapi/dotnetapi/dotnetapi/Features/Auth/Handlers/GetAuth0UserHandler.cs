using dotnetapi.Data;
using dotnetapi.Features.Users.Entities;
using dotnetapi.Services.Http;
using Mediator;

namespace dotnetapi.Features.Auth.Handlers;

public sealed record GetAuth0UserQuery(string Subject)
    : IRequest<Auth0UserDto?>;

public class GetAuth0UserHandler
    : IRequestHandler<GetAuth0UserQuery, Auth0UserDto?>
{
    private readonly IHttpClientFactoryService _authHttp;
    private readonly IDataContext _context;

    public GetAuth0UserHandler(IDataContext context, IHttpClientFactoryService authHttp)
    {
        _context = context;
        _authHttp = authHttp;
    }

    public async ValueTask<Auth0UserDto?> Handle(
        GetAuth0UserQuery request,
        CancellationToken cT
    )
    {
        return await _authHttp.GetAuthUser(request.Subject);
    }
}