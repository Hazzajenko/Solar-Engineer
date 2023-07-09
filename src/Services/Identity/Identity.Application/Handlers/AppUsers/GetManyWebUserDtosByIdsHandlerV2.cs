using ApplicationCore.Exceptions;
using FluentValidation;
using Identity.Application.Data.UnitOfWork;
using Identity.Application.Services.Connections;
using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Mapping;
using LanguageExt;
using LanguageExt.Common;
using Mediator;
using MethodTimer;
using Microsoft.Extensions.Logging;
using Projects.Domain.Entities;

namespace Identity.Application.Handlers.AppUsers;

public record GetManyWebUserDtosByIdsV2Query(AppUser AppUser, IEnumerable<Guid> WebUserIds)
    : IQuery<Result<IEnumerable<WebUserDto>>>;

public class GetManyWebUserDtosByIdsV2Handler
    : IQueryHandler<GetManyWebUserDtosByIdsV2Query, Result<IEnumerable<WebUserDto>>>
{
    private readonly IIdentityUnitOfWork _unitOfWork;
    private readonly ILogger<GetManyWebUserDtosByIdsV2Handler> _logger;
    private readonly IConnectionsService _connections;

    public GetManyWebUserDtosByIdsV2Handler(
        IIdentityUnitOfWork unitOfWork,
        ILogger<GetManyWebUserDtosByIdsV2Handler> logger,
        IConnectionsService connections
    )
    {
        _unitOfWork = unitOfWork;
        _logger = logger;
        _connections = connections;
    }

    public async ValueTask<Result<IEnumerable<WebUserDto>>> Handle(
        GetManyWebUserDtosByIdsV2Query query,
        CancellationToken cT
    )
    {
        Guid appUserId = query.AppUser.Id;
        AppUser appUser = query.AppUser;
        var appUserLinks = new List<AppUserLink>();

        foreach (Guid recipientId in query.WebUserIds)
        {
            AppUserLink? appUserLink =
                await _unitOfWork.AppUserLinksRepository.GetByBothUserIdsAsync(
                    appUserId,
                    recipientId
                );
            if (appUserLink is not null)
            {
                appUserLinks.Add(appUserLink);
                continue;
            }
            AppUser? recipientUser = await _unitOfWork.AppUsersRepository.GetByIdAsync(recipientId);
            if (recipientUser is null)
            {
                _logger.LogError("Unable to find user {UserId}", recipientId);
                var message = $"Unable to find user {recipientId}";
                var error = new ValidationException(
                    message,
                    message.ToValidationFailure<AppUser>()
                );
                return new Result<IEnumerable<WebUserDto>>(error);
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

        var webUserDtos = appUserLinks.Select(link =>
        {
            AppUser recipientAppUser =
                link.AppUserReceivedId == appUserId ? link.AppUserRequested : link.AppUserReceived;
            var isOnline = _connections.IsUserOnline(recipientAppUser.Id);
            DateTime lastActiveTime = isOnline
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

        return new Result<IEnumerable<WebUserDto>>(webUserDtos);
    }
}
