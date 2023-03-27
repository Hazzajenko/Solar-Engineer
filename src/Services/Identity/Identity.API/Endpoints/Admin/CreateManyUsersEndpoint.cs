using EventBus.Domain.AppUserEvents;
using FastEndpoints;
using Identity.Application.Data;
using Identity.Application.Data.Bogus;
using Identity.Application.Mapping;
using Identity.Application.Services.Images;
using Identity.Contracts.Data;
using Identity.Domain.Auth;
using Infrastructure.Mapping;
using Marten;
using Microsoft.AspNetCore.Identity;
using Wolverine;
using Wolverine.Marten;

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
    private readonly IMartenOutbox _outbox;
    private readonly IDocumentSession _session;
    private readonly UserManager<AppUser> _userManager;

    public CreateManyUsersEndpoint(
        UserManager<AppUser> userManager,
        IImagesService imagesService,
        IMessageBus bus,
        IMartenOutbox outbox,
        IDocumentSession session
    )
    {
        _userManager = userManager;
        _imagesService = imagesService;
        _bus = bus;
        _outbox = outbox;
        _session = session;
    }

    public override void Configure()
    {
        Post("/admin/users/create-many");
        AllowAnonymous();
    }

    public override async Task HandleAsync(CreateManyUsersRequest request, CancellationToken cT)
    {
        // _userManager.PasswordHasher;
        var appUsers = BogusGenerators.GetAppUserGenerator().Generate(request.Count);

        foreach (var appUser in appUsers)
        {
            var createUserResult = await _userManager.CreateAsync(appUser, "Password123!");

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

            // var imageUrl = $"https://robohash.org/{appUser.UserName}.png?size=30x30&set=set1";
            var getRobotImage = await _imagesService.DownloadImageAsync(appUser.PhotoUrl);

            appUser.PhotoUrl = getRobotImage;
            await _userManager.UpdateAsync(appUser);
            var guidId = Guid.NewGuid();
            var userDto = appUser.ToDto();
            var appUserCreated = new AppUserCreated(guidId, userDto);
            var appUserEventV2 = new AppUserEventV2(guidId, appUserCreated);
            _session.Store(appUserEventV2);
            await _outbox.SendAsync(appUserCreated);
            // appUser.PhotoUrl = getRobotImage;
            // await _userManager.UpdateAsync(appUser);
            /*var appUserEvent = new AppUserEvent(
                appUser.Id,
                appUser.ToDto(),
                AppUserEventType.Created
            );
            await _bus.SendAsync(appUserEvent);*/
        }

        await _session.SaveChangesAsync(cT);
        Response.Users = appUsers.Select(x => x.ToCurrentUserDto());

        await SendOkAsync(Response, cT);
    }
}