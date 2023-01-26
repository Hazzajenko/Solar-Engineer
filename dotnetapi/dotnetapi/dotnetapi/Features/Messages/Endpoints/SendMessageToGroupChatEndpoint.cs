using dotnetapi.Features.GroupChats.Handlers;
using dotnetapi.Features.GroupChats.Services;
using dotnetapi.Features.Messages.Contracts.Requests;
using dotnetapi.Features.Messages.Contracts.Responses;
using dotnetapi.Features.Messages.Handlers;
using dotnetapi.Features.Messages.Mapping;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Messages.Endpoints;

[Authorize]
public class SendMessageToGroupChatEndpoint : Endpoint<SendGroupChatMessageRequest, GroupChatMessageResponse>
{
    private readonly IGroupChatsRepository _groupChatsRepository;
    private readonly ILogger<SendMessageToGroupChatEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly IMessagesRepository _messagesRepository;
    private readonly UserManager<AppUser> _userManager;

    public SendMessageToGroupChatEndpoint(
        ILogger<SendMessageToGroupChatEndpoint> logger,
        IGroupChatsRepository groupChatsRepository,
        IMessagesRepository messagesRepository,
        IMediator mediator,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _groupChatsRepository = groupChatsRepository;
        _messagesRepository = messagesRepository;
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("message/group-chat/{groupChatId:int}");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(SendGroupChatMessageRequest request, CancellationToken ct)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("Username is invalid");
        }

        var groupChatId = Route<int>("groupChatId");
        if (groupChatId < 0) ThrowError("Invalid groupChatId");

        var appUserGroupChat = await _groupChatsRepository.GetAppUserGroupChatAsync(appUser, groupChatId);
        if (appUserGroupChat is null)
        {
            _logger.LogError("Bad request, appUserGroupChat is invalid");
            ThrowError("appUserGroupChat is invalid");
        }

        /*
        var groupChatMemberDtos = await _groupChatsRepository.GetGroupChatMembersAsync(groupChatId);

        var isUserInGroupChat = groupChatMemberDtos.FirstOrDefault(x => x.Username == user.UserName!);
        if (isUserInGroupChat is null)
        {
            _logger.LogError("Bad request, user is not in conversation");
            ThrowError("Bad request, user is not in conversation");
        }*/

        var groupChatMessage = request.ToEntity(appUser, appUserGroupChat.GroupChat);


        var addMessage = await _messagesRepository.SendMessageToGroupChatAsync(groupChatMessage, appUser);

        var groupChatMemberDtos = await _mediator.Send(new GetGroupChatMembersByIdQuery(request.GroupChatId), ct);
        var groupChatUsers = groupChatMemberDtos.Select(x => x.Username).ToArray();
        // var groupChatMemberDtos = await _groupChatsRepository.GetGroupChatMembersAsync(request.GroupChatId);
        var res = await _mediator.Send(
            new SendMessageToGroupChatSignalRQuery(groupChatMessage.ToDto(appUser), groupChatUsers),
            ct);
        // var chatMemberDtos = groupChatMemberDtos.ToList();
        // var addMessage2 = _mediator.CreateStream(new SendMessageToGroupChatSignalRQuery(groupChatMessage), ct);

        var response = new GroupChatMessageResponse
        {
            Message = addMessage
        };

        await SendOkAsync(response, ct);
    }
}