using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Services;
using dotnetapi.Models.Entities;
using FastEndpoints;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Features.GroupChats.Endpoints;

[Authorize]
public class GetGroupChatsDataEndpoint : EndpointWithoutRequest<ManyGroupChatsDto>
{
    private readonly IGroupChatsRepository _groupChatsRepository;
    private readonly ILogger<GetGroupChatsDataEndpoint> _logger;
    private readonly UserManager<AppUser> _userManager;

    public GetGroupChatsDataEndpoint(
        ILogger<GetGroupChatsDataEndpoint> logger,
        IGroupChatsRepository groupChatsRepository,
        UserManager<AppUser> userManager)
    {
        _logger = logger;
        _groupChatsRepository = groupChatsRepository;
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


        var result = await _groupChatsRepository.GetManyGroupChatsDtoAsync(appUser);

        /*if (result is null)
        {
            _logger.LogError("User {User} Group Chats are invalid", appUser.UserName);
            ThrowError("Group Chats are invalid");
        }*/


        /*
        var response = new ManyGroupChatsDataResponse
        {
            GroupChats = result
        };*/

        await SendOkAsync(result, ct);
    }
}