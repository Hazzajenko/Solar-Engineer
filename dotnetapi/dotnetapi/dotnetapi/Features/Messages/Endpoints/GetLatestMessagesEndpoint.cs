using dotnetapi.Features.Messages.Contracts.Responses;
using dotnetapi.Features.Messages.Handlers;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using dotnetapi.Services.Projects;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Messages.Endpoints;

[Authorize]
public class GetLatestMessagesEndpoint : EndpointWithoutRequest<ManyLatestUserMessagesResponse>
{
    private readonly ILogger<GetLatestMessagesEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly IMessagesRepository _messagesRepository;
    private readonly IProjectsService _projectsService;
    private readonly UserManager<AppUser> _userManager;

    public GetLatestMessagesEndpoint(
        ILogger<GetLatestMessagesEndpoint> logger,
        IMessagesRepository messagesRepository,
        IMediator mediator,
        UserManager<AppUser> userManager,
        IProjectsService projectsService)
    {
        _logger = logger;
        _messagesRepository = messagesRepository;
        _mediator = mediator;
        _userManager = userManager;
        _projectsService = projectsService;
    }

    public override void Configure()
    {
        Get("messages/latest");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }


        var messages = await _mediator.Send(new GetLatestUserMessagesQuery(appUser), ct);

        var response = new ManyLatestUserMessagesResponse
        {
            Messages = messages
        };

        await SendOkAsync(response, ct);
    }
}