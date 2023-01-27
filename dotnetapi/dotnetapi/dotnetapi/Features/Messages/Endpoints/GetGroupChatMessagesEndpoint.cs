using dotnetapi.Features.GroupChats.Handlers;
using dotnetapi.Features.Messages.Contracts.Responses;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Mediator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Messages.Endpoints;

[Authorize]
public class GetGroupChatMessagesEndpoint : EndpointWithoutRequest<GroupChatManyMessagesResponse>
{
    private readonly ILogger<GetGroupChatMessagesEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly IMessagesRepository _messagesRepository;
    private readonly UserManager<AppUser> _userManager;

    public GetGroupChatMessagesEndpoint(
        ILogger<GetGroupChatMessagesEndpoint> logger,
        IMessagesRepository messagesRepository,
        IMediator mediator,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _messagesRepository = messagesRepository;
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("messages/group-chat/{groupChatId:int}");
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

        var groupChatId = Route<int>("groupChatId");
        if (groupChatId < 0) ThrowError("Invalid groupChatId");

        /*var recipient = await _userManager.Users.Where(x => x.UserName == recipientUserName).SingleOrDefaultAsync(ct);
        if (recipient is null)
        {
            _logger.LogError("Bad request, Recipient is invalid");
            ThrowError("Recipient is invalid");
        }*/

        var groupChatMessageDtos = await _mediator.Send(new GetGroupChatMessagesByIdQuery(appUser, groupChatId), ct);
        var chatMessageDtos = groupChatMessageDtos.ToList();
        var messageIds = chatMessageDtos.Select(x => x.Id).ToList();
        var update = await _messagesRepository.MarkAllGroupChatMessagesReadByUserAsync(messageIds, appUser);

        if (groupChatMessageDtos is null)
        {
            _logger.LogError("Bad request, groupChatMessageDtos is invalid");
            ThrowError("groupChatMessageDtos is invalid");
        }

        var response = new GroupChatManyMessagesResponse
        {
            GroupChatId = groupChatId,
            Messages = chatMessageDtos
        };

        await SendOkAsync(response, ct);
    }
}