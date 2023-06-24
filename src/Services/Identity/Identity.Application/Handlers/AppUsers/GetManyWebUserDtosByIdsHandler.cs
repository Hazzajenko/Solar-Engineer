using Identity.Application.Data.UnitOfWork;
using Identity.Application.Exceptions;
using Identity.Application.Services.Connections;
using Identity.Contracts.Data;
using Identity.Domain;
using Mediator;
using MethodTimer;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Handlers.AppUsers;

public record GetManyWebUserDtosByIdsQuery(AppUser AppUser, IEnumerable<Guid> WebUserIds)
    : IQuery<IEnumerable<WebUserDto>>;

public class GetManyWebUserDtosByIdsHandler
    : IQueryHandler<GetManyWebUserDtosByIdsQuery, IEnumerable<WebUserDto>>
{
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly ILogger<GetManyWebUserDtosByIdsHandler> _logger;
    private readonly IConnectionsService _connections;

    public GetManyWebUserDtosByIdsHandler(
        IIdentityUnitOfWork unitOfWork,
        ILogger<GetManyWebUserDtosByIdsHandler> logger,
        IConnectionsService connections
    )
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _connections = connections;
    }

    [Time]
    public async ValueTask<IEnumerable<WebUserDto>> Handle(
        GetManyWebUserDtosByIdsQuery query,
        CancellationToken cT
    )
    {
        var appUserId = query.AppUser.Id;
        var appUser = query.AppUser;
        var appUserLinks = new List<AppUserLink>();

        foreach (var recipientId in query.WebUserIds)
        {
            var appUserLink = await _unitOfWork.AppUserLinksRepository.GetByBothUserIdsAsync(
                appUserId,
                recipientId
            );
            if (appUserLink is not null)
            {
                appUserLinks.Add(appUserLink);
                continue;
            }
            var recipientUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(recipientId);
            if (recipientUser is null)
            {
                _logger.LogError("Unable to find user {UserId}", recipientId);
                throw new NotFoundException($"Unable to find user {recipientId}");
            }
            appUserLink = AppUserLink.Create(appUser, recipientUser);
            await _unitOfWork.AppUserLinksRepository.AddAsync(appUserLink);
            await _unitOfWork.SaveChangesAsync();
            appUserLink = await _unitOfWork.AppUserLinksRepository.GetByBothUserIdsAsync(
                appUserId,
                recipientId
            );
            ArgumentNullException.ThrowIfNull(appUserLink);
            appUserLinks.Add(appUserLink);
        }

        /*
        if (_unitOfWork.HasChanges())
        {
            await _unitOfWork.SaveChangesAsync();
        }*/

        /*foreach (var queryWebUserId in query.WebUserIds)
        {
            
        }
        var appUserLinkTasks = query.WebUserIds.Select(async recipientId =>
        {
            var appUserLink = await _unitOfWork.AppUserLinksRepository.GetByBothUserIdsAsync(
                appUserId,
                recipientId
            );
            if (appUserLink is not null)
            {
                return appUserLink;
            }
            var recipientUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(recipientId);
            if (recipientUser is null)
            {
                _logger.LogError("Unable to find user {UserId}", recipientId);
                throw new NotFoundException($"Unable to find user {recipientId}");
            }
            appUserLink = AppUserLink.Create(appUser, recipientUser);
            await _unitOfWork.AppUserLinksRepository.AddAsync(appUserLink);
            return appUserLink;
        });*/

        // var appUserLinks = (await Task.WhenAll(appUserLinkTasks)).ToList();

        var webUserDtos = appUserLinks.Select(link =>
        {
            var recipientAppUser =
                link.AppUserReceivedId == appUserId ? link.AppUserRequested : link.AppUserReceived;
            var isOnline = _connections.IsUserOnline(recipientAppUser.Id);
            var lastActiveTime = isOnline
                ? _connections.GetLastActiveTime(recipientAppUser.Id)
                : recipientAppUser.LastActiveTime;
            var webUserDto = new WebUserDto
            {
                Id = recipientAppUser.Id.ToString(),
                DisplayName = recipientAppUser.DisplayName,
                PhotoUrl = recipientAppUser.PhotoUrl,
                UserName = recipientAppUser.UserName,
                IsFriend = link.Friends,
                IsOnline = isOnline,
                BecameFriendsTime = link.BecameFriendsTime,
                RegisteredAtTime = recipientAppUser.CreatedTime,
                LastActiveTime = lastActiveTime
            };
            return webUserDto;
        });

        return webUserDtos;
    }
}
