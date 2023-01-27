using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Strings;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Strings;

[Authorize]
public class UpdateStringEndpoint : Endpoint<UpdateStringRequest, OneUpdateResponse>
{
    private readonly ILogger<UpdateStringEndpoint> _logger;
    private readonly IStringsService _stringsService;
    private readonly UserManager<AppUser> _userManager;

    public UpdateStringEndpoint(
        ILogger<UpdateStringEndpoint> logger,
        IStringsService stringsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _stringsService = stringsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Put("/projects/{projectId:int}/string");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(UpdateStringRequest request, CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var update = await _stringsService.UpdateStringAsync(request);

        var response = new OneUpdateResponse
        {
            Update = true
        };

        await SendOkAsync(response, cT);
    }
}