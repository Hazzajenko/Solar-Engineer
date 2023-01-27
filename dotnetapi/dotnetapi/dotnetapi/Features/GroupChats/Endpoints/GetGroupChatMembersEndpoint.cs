using dotnetapi.Features.GroupChats.Contracts.Responses;
using dotnetapi.Features.GroupChats.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.GroupChats.Endpoints;

[Authorize]
public class GetGroupChatMembersEndpoint : EndpointWithoutRequest<GroupChatMembersResponse>
{
    private readonly IGroupChatsRepository _groupChatsRepository;
    private readonly ILogger<GetGroupChatMembersEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;

    public GetGroupChatMembersEndpoint(
        ILogger<GetGroupChatMembersEndpoint> logger,
        IGroupChatsRepository groupChatsRepository,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _groupChatsRepository = groupChatsRepository;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("group-chat/{groupChatId:int}/members");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var groupChatId = Route<int>("groupChatId");
        if (groupChatId < 0) ThrowError("Invalid groupChatId");


        var result = await _groupChatsRepository.GetGroupChatMembersAsync(groupChatId);

        var groupChatMemberDtos = result.ToList();
        var isUserInGroupChat = groupChatMemberDtos.SingleOrDefault(x => x.UserName == user.UserName!);

        if (isUserInGroupChat is null)
        {
            _logger.LogError("User {User} is not in Group Chat", user.UserName);
            ThrowError("User is not in Group Chat");
        }

        var response = new GroupChatMembersResponse
        {
            Members = groupChatMemberDtos
        };

        await SendOkAsync(response, ct);
    }
}