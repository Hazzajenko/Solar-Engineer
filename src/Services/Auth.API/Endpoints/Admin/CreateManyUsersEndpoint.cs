using Auth.API.Contracts.Data;
using Auth.API.Data.Bogus;
using Auth.API.Entities;
using Auth.API.Exceptions;
using Auth.API.Mapping;
using FastEndpoints;
using Microsoft.AspNetCore.Identity;

namespace Auth.API.Endpoints.Admin;

public class CreateManyUsersRequest
{
    public int Count { get; set; } = 5;
}

public class CreateManyUsersResponse
{
    public IEnumerable<CurrentUserDto> Users { get; set; } = default!;
}

public class CreateManyUsersEndpoint : Endpoint<CreateManyUsersRequest, CreateManyUsersResponse>
{
    private readonly UserManager<AuthUser> _userManager;

    public CreateManyUsersEndpoint(UserManager<AuthUser> userManager)
    {
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("/admin/users/create-many");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CreateManyUsersRequest request, CancellationToken cT)
    {
        var appUsers = BogusGenerators.GetAuthUserGenerator().Generate(request.Count);

        foreach (var appUser in appUsers)
        {
            var createUserResult = await _userManager.CreateAsync(appUser);
            if (createUserResult.Succeeded)
                continue;
            Logger.LogError(
                "Unable to create user {@User}, {@Errors}",
                appUser,
                createUserResult.Errors
            );
        }

        // appUsers.ForEach(CreateAsync);

        Response.Users = appUsers.Select(x => x.ToCurrentUserDto());

        await SendOkAsync(Response, cT);
    }

    private async void CreateAsync(AuthUser appUser)
    {
        var createUserResult = await _userManager.CreateAsync(appUser);
        if (createUserResult.Succeeded)
            return;
        Logger.LogError(
            "Unable to create user {@User}, {@Errors}",
            appUser,
            createUserResult.Errors
        );
        throw new UnauthorizedException();
    }
}