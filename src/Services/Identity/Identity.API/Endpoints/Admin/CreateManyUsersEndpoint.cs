using EventBus.Domain.AppUserEvents;
using FastEndpoints;
using Identity.Application.Data;
using Identity.Application.Data.Bogus;
using Identity.Application.Mapping;
using Identity.Application.Services.Images;
using Identity.Contracts.Data;
using Identity.Domain.Auth;
using Infrastructure.Mapping;
using Microsoft.AspNetCore.Identity;
using Wolverine;

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
    private readonly IMessageBus _bus;
    private readonly IImagesService _imagesService;
    private readonly UserManager<AppUser> _userManager;

    public CreateManyUsersEndpoint(
        UserManager<AppUser> userManager,
        IImagesService imagesService,
        IMessageBus bus
    )
    {
        _userManager = userManager;
        _imagesService = imagesService;
        _bus = bus;
    }

    public override void Configure()
    {
        Post("/admin/users/create-many");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CreateManyUsersRequest request, CancellationToken cT)
    {
        var appUsers = BogusGenerators.GetAppUserGenerator().Generate(request.Count);

        foreach (var appUser in appUsers)
        {
            var createUserResult = await _userManager.CreateAsync(appUser);

            if (!createUserResult.Succeeded)
            {
                Logger.LogError(
                    "Unable to create user {@User}, {@Errors}",
                    appUser,
                    createUserResult.Errors
                );
                continue;
            }

            var addRoleResult = await _userManager.AddToRoleAsync(appUser, AppRoles.User);
            if (!addRoleResult.Succeeded)
            {
                Logger.LogError(
                    "Unable to add role to user {@User}, {@Errors}",
                    appUser,
                    addRoleResult.Errors
                );
                continue;
            }

            var imageUrl = $"https://robohash.org/{appUser.UserName}.png?size=30x30&set=set1";
            var getRobotImage = await _imagesService.DownloadImageAsync(imageUrl);

            appUser.PhotoUrl = getRobotImage;
            await _userManager.UpdateAsync(appUser);
            var appUserEvent = new AppUserEvent(
                appUser.Id,
                appUser.ToDto(),
                AppUserEventType.Created
            );
            await _bus.SendAsync(appUserEvent);
        }

        Response.Users = appUsers.Select(x => x.ToCurrentUserDto());

        await SendOkAsync(Response, cT);
    }
}