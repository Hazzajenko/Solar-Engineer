using System.Security.Claims;
using FastEndpoints;
using Infrastructure.Extensions;
using Mediator;
using Users.API.Contracts.Requests;
using Users.API.Data;
using Users.API.Entities;
using Users.API.Grpc;
using Users.API.Repositories;

namespace Users.API.Handlers;

public sealed record UserEventCommand(ClaimsPrincipal User, UserEventRequest Request)
    : Mediator.ICommand<bool>;

public class UserEventHandler
    : Mediator.ICommandHandler<UserEventCommand, bool>
{
    // private readonly IAuthGrpcService _auth;
    private readonly ILogger<UserEventHandler> _logger;
    private readonly IUsersUnitOfWork _unitOfWork;

    private readonly IMediator _mediator;
    // private readonly IUsersContext _unitOfWork;
    // private readonly IUserLinksRepository _userLinksRepository;


    public UserEventHandler(ILogger<UserEventHandler> logger, IUsersUnitOfWork unitOfWork, IMediator mediator)
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
        // _auth = auth;
        // _userLinksRepository = userLinksRepository;
        // _unitOfWork = unitOfWork;
        _mediator = mediator;
    }

    public async ValueTask<bool> Handle(
        UserEventCommand request,
        CancellationToken cT
    )
    {
        var userId = request.User.GetUserId();
        /*var appUser = await _auth.GetAppUserById(userId);

        var recipientUser = await _auth.GetAppUserById(request.Request.UserId);

        var userLink = await _userLinksRepository.GetByBothUsersAsync(appUser, recipientUser);
        if (userLink is null)
        {
            var newLink = new UserLink(appUser, recipientUser);
            await _userLinksRepository.AddAsync(newLink);
            await _unitOfWork.SaveChangesAsync(cT);
            userLink = newLink;
        }

        switch (request.Request.Event)
        {
            case UserEvent.SendFriendRequest:
                await _mediator.Send(
                    new SendFriendRequestCommand(userLink, appUser), cT);
                break;
            case UserEvent.AcceptFriendRequest:
                await _mediator.Send(
                    new AcceptFriendRequestCommand(userLink, appUser), cT);
                break;
            case UserEvent.RejectFriendRequest:
                await _mediator.Send(
                    new RejectFriendRequestCommand(userLink, appUser), cT);
                break;
            default:
                _logger.LogError("Unknown request from User {User} Event {Event}", appUser.Id, request.Request.Event);
                throw new ValidationFailureException($"unknown request {request.Request.Event}");
        }*/


        return true;
    }
}