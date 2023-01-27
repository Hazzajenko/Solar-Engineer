using dotnetapi.Features.GroupChats.Contracts.Requests;
using dotnetapi.Features.GroupChats.Contracts.Responses;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using dotnetapi.Features.GroupChats.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.GroupChats.Endpoints;

[Authorize]
public class CreateGroupChatEndpoint : Endpoint<CreateGroupChatRequest, CreateGroupChatResponse>
{
    private readonly IGroupChatsRepository _groupChatsRepository;
    private readonly ILogger<CreateGroupChatEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;

    public CreateGroupChatEndpoint(
        ILogger<CreateGroupChatEndpoint> logger,
        IGroupChatsRepository groupChatsRepository,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _groupChatsRepository = groupChatsRepository;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Post("group-chat");
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(CreateGroupChatRequest request, CancellationToken ct)
    {
        var user = await _userManager.GetUserAsync(User);
        if (user is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }


        var appUserGroupChat = new AppUserGroupChat
        {
            AppUser = user,
            Role = "Admin",
            CanInvite = true,
            CanKick = true,
            JoinedAt = DateTime.Now
        };

        var groupChat = new GroupChat
        {
            Name = request.Name,
            AppUserGroupChats = new List<AppUserGroupChat> { appUserGroupChat }
        };


        appUserGroupChat.GroupChat = groupChat;

        var result = await _groupChatsRepository.CreateGroupChatAsync(appUserGroupChat);
        appUserGroupChat.ToMemberDto();

        var response = result.GroupChat.ToResponse(new List<GroupChatMemberDto> { appUserGroupChat.ToMemberDto() });

        /*// var member = user.ToDto();
        // member.

        var response = new CreateGroupChatResponse
        {
            GroupChat = new GroupChatDto
            {
                Id = result.Id,
                Name = result.Name,
                Members = new List<GroupChatMemberDto>
                {
                    new()
                    {
                        FirstName = user.FirstName,
                        Role = "Admin",
                        UserName = user.UserName!,
                        LastName = user.LastName,
                        JoinedAt = DateTime.Now
                    }
                }
            }
        };*/

        await SendOkAsync(response, ct);
    }
}