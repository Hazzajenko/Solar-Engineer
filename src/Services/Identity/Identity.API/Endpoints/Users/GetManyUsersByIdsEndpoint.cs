using FastEndpoints;
using Identity.Application.Handlers.AppUsers.GetAppUser;
using Identity.Application.Handlers.AppUsers.GetAppUserDto;
using Identity.Application.Mapping;
using Identity.Contracts.Data;
using Identity.Contracts.Responses;
using Infrastructure.Extensions;
using Mediator;

namespace Identity.API.Endpoints.Users;

public class GetManyUsersByIdsRequest
{
    public IEnumerable<string> AppUserIds { get; set; } = new List<string>();
}

public class GetManyUsersByIdsResponse
{
    public IEnumerable<AppUserDto> AppUsers { get; set; } = new List<AppUserDto>();
}

public class GetManyUsersByIdsEndpoint
    : Endpoint<GetManyUsersByIdsRequest, GetManyUsersByIdsResponse>
{
    private readonly IMediator _mediator;

    public GetManyUsersByIdsEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("/users");
        AuthSchemes("bearer");
    }

    public override async Task HandleAsync(GetManyUsersByIdsRequest request, CancellationToken cT)
    {
        var appUser = await _mediator.Send(new GetAppUserQuery(User), cT);
        if (appUser is null)
        {
            Logger.LogError("Unable to find user {UserId}", User.GetUserId());
            await SendUnauthorizedAsync(cT);
            return;
        }

        var queryUserIds = request.AppUserIds.Select(Guid.Parse);

        var userByQuery = await _mediator.Send(new GetManyAppUserDtosByIdsQuery(queryUserIds), cT);

        Response.AppUsers = userByQuery;
        await SendOkAsync(Response, cT);
    }
}
