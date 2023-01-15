using dotnetapi.Contracts.Responses;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Strings;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Endpoints.Strings;

[Authorize]
public class GetAllStringsEndpoint : EndpointWithoutRequest<ManyStringsResponse>
{
    private readonly ILogger<GetAllStringsEndpoint> _logger;
    private readonly IStringsService _stringsService;
    private readonly UserManager<AppUser> _userManager;

    public GetAllStringsEndpoint(
        ILogger<GetAllStringsEndpoint> logger,
        IStringsService stringsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _stringsService = stringsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("/projects/{projectId:int}/strings");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var projectId = Route<int>("projectId");
        if (projectId < 0) ThrowError("Invalid project Id");

        var stringDtos = await _stringsService.GetAllStringsByProjectIdAsync(projectId);

        var response = new ManyStringsResponse
        {
            Strings = stringDtos
        };

        await SendOkAsync(response, cT);
    }
}