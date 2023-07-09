using ApplicationCore.Entities;
using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using FastEndpoints;
using Identity.Application.Handlers.AppUsers;
using Identity.Application.Logging;
using Identity.Contracts.Data;
using Identity.Domain;
using LanguageExt;
using Mediator;
using Microsoft.AspNetCore.Identity;

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
    private readonly UserManager<AppUser> _userManager;

    public GetManyUsersByIdsEndpoint(IMediator mediator, UserManager<AppUser> userManager)
    {
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("/users");
        AuthSchemes("bearer");
    }

    public override async Task HandleAsync(GetManyUsersByIdsRequest request, CancellationToken cT)
    {
        AppUser? appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            NonAuthenticatedUser nonAuthUser = User.TryGetUserIdAndName();
            Logger.LogUserNotFound(nonAuthUser.UserId, nonAuthUser.UserName);
            await SendUnauthorizedAsync(cT);
            return;
        }

        var queryUserIds = request.AppUserIds.Select(Guid.Parse);

        var userByQueryResult = await _mediator.Send(
            new GetManyWebUserDtosByIdsV2Query(appUser, queryUserIds),
            cT
        );

        userByQueryResult.IfFail(exception =>
        {
            ThrowError(x => x.AppUserIds, "Invalid user ids");
        });

        var userByQuery = userByQueryResult.Match(res => res, _ => Enumerable.Empty<WebUserDto>());

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
