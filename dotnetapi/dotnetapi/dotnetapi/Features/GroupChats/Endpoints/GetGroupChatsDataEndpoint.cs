using dotnetapi.Features.GroupChats.Contracts.Responses;
using dotnetapi.Features.GroupChats.Handlers;
using dotnetapi.Features.GroupChats.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.GroupChats.Endpoints;

[Authorize]
public class GetGroupChatsDataEndpoint : EndpointWithoutRequest<ManyGroupChatsDataResponse>
{
    private readonly IGroupChatsRepository _groupChatsRepository;
    private readonly ILogger<GetGroupChatsDataEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public GetGroupChatsDataEndpoint(
        ILogger<GetGroupChatsDataEndpoint> logger,
        IGroupChatsRepository groupChatsRepository,
        IMediator mediator,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _groupChatsRepository = groupChatsRepository;
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("group-chats/data");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }


        var groupChatIds = await _mediator.Send(new GetGroupChatIdsQuery(appUser), ct);
        var groupChats = await _mediator.Send(new GetGroupChatsQuery(appUser), ct);
        var members = await _mediator.Send(new GetGroupChatMembersQuery(groupChatIds), ct);
        var messages = await _mediator.Send(new GetGroupChatMessagesQuery(appUser, groupChatIds), ct);


        var response = new ManyGroupChatsDataResponse
        {
            GroupChats = groupChats,
            GroupChatMembers = members,
            GroupChatMessages = messages
        };

        await SendOkAsync(response, ct);
    }
}