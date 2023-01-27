using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Strings;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Strings;

[Authorize]
public class DeleteStringEndpoint : EndpointWithoutRequest<OneDeleteResponse>
{
    private readonly ILogger<DeleteStringEndpoint> _logger;
    private readonly IStringsService _stringsService;
    private readonly UserManager<AppUser> _userManager;

    public DeleteStringEndpoint(
        ILogger<DeleteStringEndpoint> logger,
        IStringsService stringsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _stringsService = stringsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Delete("/projects/{projectId:int}/string/{stringId}");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var stringId = Route<string>("stringId");
        if (string.IsNullOrEmpty(stringId)) ThrowError("Invalid stringId");

        var deleted = await _stringsService.DeleteAsync(stringId);

        var response = new OneDeleteResponse
        {
            Delete = true
        };

        await SendOkAsync(response, cT);
    }
}