using FastEndpoints;
using Identity.Application.Services.DockerHub;
using Identity.Contracts.Requests.Errors;
using Identity.Domain;
using Infrastructure.Logging;
using Microsoft.AspNetCore.Identity;

namespace Identity.API.Endpoints.App;

public class SendWebUiErrorEndpoint : Endpoint<SendAppErrorRequest>
{
    private readonly UserManager<AppUser> _userManager;

    public SendWebUiErrorEndpoint(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("/error");
        AllowAnonymous();
        Throttle(hitLimit: 20, durationSeconds: 60);
    }

    public override async Task HandleAsync(SendAppErrorRequest request, CancellationToken cT)
    {
        var appUser = await _userManager.GetUserAsync(User);
        var message = request.Message;
        var stackTrace = request.StackTrace;
        if (appUser is null)
        {
            Logger.LogError(
                "Web UI Error: Unauthenticated User: {ErrorMessage} - {StackTrace}",
                message,
                stackTrace
            );
            await SendOkAsync(cT);
            return;
        }

        Logger.LogError(
            "Web UI Error: User {UserId} - {UserName}: {ErrorMessage} - {StackTrace}",
            appUser.Id,
            appUser.UserName,
            message,
            stackTrace
        );
        await SendOkAsync(cT);
    }
}
