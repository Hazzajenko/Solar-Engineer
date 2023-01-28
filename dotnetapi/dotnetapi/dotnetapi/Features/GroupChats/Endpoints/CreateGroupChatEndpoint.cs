using dotnetapi.Features.GroupChats.Contracts.Requests;
using dotnetapi.Features.GroupChats.Contracts.Responses;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Handlers;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Features.GroupChats.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.GroupChats.Endpoints;

[Authorize]
public class CreateGroupChatEndpoint : Endpoint<CreateGroupChatRequest, CreateGroupChatResponse>
{
    private readonly IGroupChatsRepository _groupChatsRepository;
    private readonly ILogger<CreateGroupChatEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public CreateGroupChatEndpoint(
        ILogger<CreateGroupChatEndpoint> logger,
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
        Post("group-chats");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CreateGroupChatRequest request, CancellationToken ct)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }


        var appUserGroupChat = new AppUserGroupChat
        {
            AppUser = appUser,
            Role = "Admin",
            CanInvite = true,
            CanKick = true,
            JoinedAt = DateTime.Now
        };

        var groupChat = new GroupChat
        {
            Name = request.GroupChatName,
            CreatedBy = appUser,
            AppUserGroupChats = new List<AppUserGroupChat> { appUserGroupChat }
        };


        appUserGroupChat.GroupChat = groupChat;

        var result = await _mediator.Send(new CreateGroupChatQuery(appUserGroupChat), ct);
        // var result = await _groupChatsRepository.CreateGroupChatAsync(appUserGroupChat);
        // appUserGroupChat.ToMemberDto();
        // result.GroupChat.ToResponse()

        var response = result.GroupChat.ToResponse(new List<GroupChatMemberDto> { appUserGroupChat.ToMemberDto() });

        await SendOkAsync(response, ct);
    }
}