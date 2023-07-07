using ApplicationCore.Entities;
using ApplicationCore.Extensions;
using FastEndpoints;
using Identity.Application.Logging;
using Identity.Application.Mapping;
using Identity.Application.Queries.AppUsers;
using Identity.Application.Repositories.AppUsers;
using Identity.Contracts.Data;
using Identity.Contracts.Responses;
using Identity.Domain;
using Infrastructure.Extensions;
using Mediator;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Endpoints.Users;

public class GetUserByIdEndpoint : EndpointWithoutRequest<AppUserDto>
{
    private readonly UserManager<AppUser> _userManager;
    private readonly IAppUsersRepository _appUsersRepository;

    public GetUserByIdEndpoint(
        UserManager<AppUser> userManager,
        IAppUsersRepository appUsersRepository
    )
    {
        _userManager = userManager;
        _appUsersRepository = appUsersRepository;
    }

    public override void Configure()
    {
        Get("/user/{appUserId}");
        AuthSchemes("bearer");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        AppUser? appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            NonAuthenticatedUser nonAuthUser = User.TryGetUserIdAndName();
            Logger.LogUserNotFound(nonAuthUser.UserId, nonAuthUser.UserName);
            await SendUnauthorizedAsync(cT);
            return;
        }

        var userQueryId = Route<string>("appUserId");
        if (userQueryId is null)
        {
            Logger.LogError("Unable to find appUserId in route");
            ThrowError("Unable to find appUserId in route");
            await SendNoContentAsync(cT);
            return;
        }

        AppUserDto? userByQuery = await _appUsersRepository.GetAppUserDtoByIdAsync(
            userQueryId.ToGuid()
        );
        if (userByQuery is null)
        {
            Logger.LogUserNotFound(userQueryId);
            await SendNoContentAsync(cT);
            return;
        }

        Logger.LogTrace(
            "User {UserName} - ({UserId}): Queried user {QueryUserId} - {QueryUserName}",
            appUser.UserName,
            appUser.Id,
            userByQuery.Id,
            userByQuery.UserName
        );

        Response = userByQuery;
        await SendOkAsync(Response, cT);
    }
}
