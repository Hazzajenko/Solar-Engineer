using Identity.Application.Commands;
using Identity.Application.Extensions;
using Identity.Application.Services.AzureStorage;
using Identity.Application.Services.Images;
using Identity.Domain;
using Mediator;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.Auth;

public class CreateInitialDpHandler
    : IRequestHandler<CreateInitialDpCommand, CreateInitialDpResponse>
{
    private readonly ILogger<CreateInitialDpHandler> _logger;
    private readonly SignInManager<AppUser> _signInManager;
    private readonly UserManager<AppUser> _userManager;
    private readonly IImagesService _imagesService;
    private readonly IAzureStorage _azureStorage;

    public CreateInitialDpHandler(
        UserManager<AppUser> userManager,
        ILogger<CreateInitialDpHandler> logger,
        SignInManager<AppUser> signInManager,
        IImagesService imagesService,
        IAzureStorage azureStorage
    )
    {
        _userManager = userManager;
        _logger = logger;
        _signInManager = signInManager;
        _imagesService = imagesService;
        _azureStorage = azureStorage;
    }

    public async ValueTask<CreateInitialDpResponse> Handle(
        CreateInitialDpCommand command,
        CancellationToken cT
    )
    {
        var appUser = command.AppUser;
        var imagesBytes = _imagesService.CreateDpImageToByteArray(appUser);

        var result = await _azureStorage.UploadImageToBlobStorage(
            imagesBytes,
            appUser.Id.ToString()
        );

        if (result is null)
        {
            _logger.LogError(
                "{User} failed to upload image to blob storage",
                appUser.GetLoggingString()
            );
            throw new Exception("Error uploading image to blob storage");
        }

        var photoUrl = result.Blob.Uri;
        if (photoUrl is null)
        {
            _logger.LogError(
                "{User} failed to upload image to blob storage",
                appUser.GetLoggingString()
            );

            throw new Exception("Error uploading image to blob storage");
        }
        _logger.LogInformation(
            "{User} uploaded image to blob storage: {Uri}",
            appUser.GetLoggingString(),
            photoUrl
        );

        return new CreateInitialDpResponse { PhotoUrl = photoUrl };
    }
}
