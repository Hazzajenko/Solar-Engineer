using dotnetapi.Features.Messages.Contracts.Responses;
using dotnetapi.Features.Messages.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.Messages.Endpoints;

[Authorize]
public class GetGroupChatMessagesEndpoint : EndpointWithoutRequest<GroupChatManyMessagesResponse>
{
    private readonly ILogger<GetGroupChatMessagesEndpoint> _logger;
    private readonly IMessagesRepository _messagesRepository;
    private readonly UserManager<AppUser> _userManager;

    public GetGroupChatMessagesEndpoint(
        ILogger<GetGroupChatMessagesEndpoint> logger,
        IMessagesRepository messagesRepository,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _messagesRepository = messagesRepository;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("messages/group-chat/{groupChatId:int}");
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

        var groupChatId = Route<int>("groupChatId");
        if (groupChatId < 0) ThrowError("Invalid groupChatId");

        /*var recipient = await _userManager.Users.Where(x => x.UserName == recipientUsername).SingleOrDefaultAsync(ct);
        if (recipient is null)
        {
            _logger.LogError("Bad request, Recipient is invalid");
            ThrowError("Recipient is invalid");
        }*/

        var groupChatMessageDtos = await _messagesRepository.GetGroupChatMessagesAsync(groupChatId);
        if (groupChatMessageDtos is null)
        {
            _logger.LogError("Bad request, groupChatMessageDtos is invalid");
            ThrowError("groupChatMessageDtos is invalid");
        }

        var response = new GroupChatManyMessagesResponse
        {
            GroupChatId = groupChatId,
            Messages = groupChatMessageDtos
        };

        await SendOkAsync(response, ct);
    }
}