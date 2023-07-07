using ApplicationCore.Entities;
using ApplicationCore.Extensions;
using FastEndpoints;
using Identity.Application.Handlers.AppUsers;
using Identity.Application.Logging;
using Identity.Application.Mapping;
using Identity.Application.Queries.AppUsers;
using Identity.Application.Services.Connections;
using Identity.Contracts.Data;
using Identity.Contracts.Responses;
using Identity.Domain;
using Infrastructure.Extensions;
using Mediator;
using MethodTimer;

namespace Identity.API.Endpoints.Users;

public class GetManyUsersByIdsRequest
{
    public IEnumerable<string> AppUserIds { get; set; } = new List<string>();
}

public class GetManyUsersByIdsResponse
{
    public IEnumerable<WebUserDto> AppUsers { get; set; } = new List<WebUserDto>();
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
        Post("/users");
        AuthSchemes("bearer");
    }

    public override async Task HandleAsync(GetManyUsersByIdsRequest request, CancellationToken cT)
    {
        AppUser? appUser = await _mediator.Send(new GetAppUserQuery(User), cT);
        if (appUser is null)
        {
            NonAuthenticatedUser nonAuthUser = User.TryGetUserIdAndName();
            Logger.LogUserNotFound(nonAuthUser.UserId, nonAuthUser.UserName);
            await SendUnauthorizedAsync(cT);
            return;
        }

        var queryUserIds = request.AppUserIds.Select(Guid.Parse);
        var userByQuery = await _mediator.Send(
            new GetManyWebUserDtosByIdsQuery(appUser, queryUserIds),
            cT
        );

        Logger.LogTrace(
            "User {UserName} - ({UserId}) requested {UserCount} users",
            appUser.Id,
            appUser.UserName,
            userByQuery.Count()
        );

        Response.AppUsers = userByQuery;
        await SendOkAsync(Response, cT);
    }
}
