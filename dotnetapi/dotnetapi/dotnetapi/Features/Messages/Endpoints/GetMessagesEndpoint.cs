using dotnetapi.Features.Messages.Contracts.Responses;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Messages.Endpoints;

[Authorize]
public class GetMessagesEndpoint : EndpointWithoutRequest<ManyMessagesResponse>
{
    private readonly ILogger<GetMessagesEndpoint> _logger;
    private readonly IMessagesRepository _messagesRepository;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public GetMessagesEndpoint(
        ILogger<GetMessagesEndpoint> logger,
        IMessagesRepository messagesRepository,
        UserManager<AppUser> userManager,
        IProjectsService projectsService)
    {
        _logger = logger;
        _messagesRepository = messagesRepository;
        _userManager = userManager;
        _projectsService = projectsService;
    }

    public override void Configure()
    {
        Get("messages");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }


        var messages = await _messagesRepository.GetMessageDtosAsync(user);

        var response = new ManyMessagesResponse
        {
            Messages = messages
        };

        await SendOkAsync(response, ct);
    }
}