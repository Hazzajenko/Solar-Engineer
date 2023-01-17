using dotnetapi.Contracts.Requests;
using dotnetapi.Contracts.Responses;
using dotnetapi.Mapping;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Strings;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Strings;

[Authorize]
public class CreateStringEndpoint : Endpoint<CreateStringRequest, OneStringResponse>
{
    private readonly ILogger<CreateStringEndpoint> _logger;
    private readonly IStringsService _stringsService;
    private readonly UserManager<AppUser> _userManager;

    public CreateStringEndpoint(
        ILogger<CreateStringEndpoint> logger,
        IStringsService stringsService,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _stringsService = stringsService;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("projects/{projectId:int}/strings");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CreateStringRequest request, CancellationToken cancellationToken)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var projectId = Route<int>("projectId");
        if (projectId < 0) ThrowError("Invalid project Id");

        var stringEntity = request.ToEntity(user);

        var stringDto = await _stringsService.CreateStringAsync(stringEntity, projectId);

        var response = new OneStringResponse
        {
            String = stringDto
        };

        _logger.LogInformation("{Username} created a new string {String}, in project {Project}",
            user.UserName,
            stringDto.Name,
            projectId.ToString());

        await SendOkAsync(response, cancellationToken);
    }
}