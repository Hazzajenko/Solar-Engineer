namespace Users.API.Endpoints;

/*
[Authorize]
public class GetUserFriendsEndpoint
    : Endpoint<GenericUserNameRequest, GetRecipientUserLinksResponse>
{
    private readonly ILogger<GetUserFriendsEndpoint> _logger;
    private readonly IMediator _mediator;
    private readonly UserManager<AppUser> _userManager;

    public GetUserFriendsEndpoint(
        ILogger<GetUserFriendsEndpoint> logger,
        IMediator mediator,
        UserManager<AppUser> userManager
    )
    {
        _logger = logger;
        _mediator = mediator;
        _userManager = userManager;
    }

    public override void Configure()
    {
        Get("users/{@userName}/friends", x => new { x.UserName });
        Policies("BeAuthenticated");
    }

    public override async Task HandleAsync(GenericUserNameRequest request, CancellationToken cT)
    {
        var appUser = await _userManager.GetUserAsync(User);
        if (appUser is null)
        {
            _logger.LogError("Bad request, User is invalid");
            ThrowError("UserName is invalid");
        }

        var recipientUser = await _mediator.Send(new GetUserByUserNameQuery(request.UserName), cT);
        if (recipientUser is null)
        {
            _logger.LogError("Bad request, recipientUser is invalid");
            ThrowError("recipientUser is invalid");
        }

        Response.RecipientUserFriends = await _mediator.Send(new GetUserFriendsQuery(appUser), cT);
        await SendOkAsync(Response, cT);
    }
}*/