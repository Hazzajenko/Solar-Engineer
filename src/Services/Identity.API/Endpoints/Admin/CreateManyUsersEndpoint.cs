using FastEndpoints;
using Identity.Application.Data.Bogus;
using Identity.Application.Entities;
using Identity.Application.Mapping;
using Identity.Contracts.Data;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Endpoints.Admin;

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
    private readonly UserManager<AppUser> _userManager;

    public CreateManyUsersEndpoint(UserManager<AppUser> userManager)
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
        var appUsers = BogusGenerators.GetAppUserGenerator().Generate(request.Count);
        // var appUsers = BogusGenerators.GetAuthUserGenerator().Generate(request.Count);

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
}