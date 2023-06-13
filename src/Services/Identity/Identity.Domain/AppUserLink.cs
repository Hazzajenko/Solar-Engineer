using Ardalis.SmartEnum;
using FluentValidation;
using Infrastructure.Common;

// using Infrastructure.Entities.Identity;

namespace Identity.Domain;

public class AppUserLink : IEntityToEntity
{
    public AppUserLink(AppUser appUser, AppUser recipient)
    {
        AppUserRequestedId = appUser.Id;
        AppUserReceivedId = recipient.Id;
        CreatedTime = DateTime.Now;
    }

    public AppUserLink() { }

    public AppUser AppUserRequested { get; set; } = default!;
    public Guid AppUserRequestedId { get; set; }
    public AppUser AppUserReceived { get; set; } = default!;
    public Guid AppUserReceivedId { get; set; }
    public DateTime? BecameFriendsTime { get; set; }
    public bool Friends { get; set; }
    public FriendRequestStatus AppUserRequestedFriendRequestStatus { get; set; } =
        FriendRequestStatus.Null;
    public FriendRequestStatus AppUserReceivedFriendRequestStatus { get; set; } =
        FriendRequestStatus.Null;

    public DateTime LastFriendRequestStatusChangeTime { get; set; }
    public DateTime CreatedTime { get; set; } = DateTime.Now;
    public DateTime LastModifiedTime { get; set; } = DateTime.Now;

    public static AppUserLink Create(AppUser appUser, AppUser recipient)
    {
        var userLink = new AppUserLink(appUser, recipient);
        return userLink;
    }

    public static AppUserLink CreateWithFriendRequestSent(
        AppUser senderAppUser,
        AppUser recipientAppUser
    )
    {
        var userLink = new AppUserLink(senderAppUser, recipientAppUser);
        userLink.SendFriendRequest(senderAppUser);
        return userLink;
    }

    public void AcceptFriendRequest()
    {
        TransitionRequestedTo(FriendRequestStatus.Accepted);
        TransitionReceivedTo(FriendRequestStatus.Accepted);

        Friends = true;
        BecameFriendsTime = DateTime.Now;
    }

    public void SendFriendRequest(AppUser appUserDispatching)
    {
        if (IsAppUserRequested(appUserDispatching))
        {
            TransitionRequestedTo(FriendRequestStatus.SentPending);
            TransitionReceivedTo(FriendRequestStatus.ReceivedPending);
            return;
        }

        TransitionRequestedTo(FriendRequestStatus.ReceivedPending);
        TransitionReceivedTo(FriendRequestStatus.SentPending);
    }

    public void RejectFriendRequest(AppUser appUserDispatching)
    {
        if (IsAppUserRequested(appUserDispatching))
        {
            TransitionRequestedTo(FriendRequestStatus.SentRejected);
            TransitionReceivedTo(FriendRequestStatus.ReceivedRejected);
            return;
        }

        TransitionRequestedTo(FriendRequestStatus.ReceivedRejected);
        TransitionReceivedTo(FriendRequestStatus.SentRejected);
    }

    public void RemoveFriend(AppUser appUserDispatching)
    {
        if (IsAppUserRequested(appUserDispatching))
        {
            TransitionRequestedTo(FriendRequestStatus.SentRemoval);
            TransitionReceivedTo(FriendRequestStatus.ReceivedRemoval);
            return;
        }

        TransitionRequestedTo(FriendRequestStatus.ReceivedRemoval);
        TransitionReceivedTo(FriendRequestStatus.SentRemoval);
        Friends = false;
        // BecameFriendsTime = DateTime.Now;
    }

    private void TransitionRequestedTo(FriendRequestStatus status)
    {
        AppUserRequestedFriendRequestStatus = status;
    }

    private void TransitionReceivedTo(FriendRequestStatus status)
    {
        AppUserReceivedFriendRequestStatus = status;
    }

    private bool IsAppUserRequested(AppUser appUserDispatching)
    {
        return AppUserRequestedId == appUserDispatching.Id;
    }
}

public sealed class FriendRequestStatus : SmartEnum<FriendRequestStatus>
{
    public static readonly FriendRequestStatus Null = new(nameof(Null), 1);
    public static readonly FriendRequestStatus SentPending = new(nameof(SentPending), 2);

    public static readonly FriendRequestStatus SentRejected = new(nameof(SentRejected), 3);
    public static readonly FriendRequestStatus ReceivedPending = new(nameof(ReceivedPending), 4);
    public static readonly FriendRequestStatus ReceivedRejected = new(nameof(ReceivedRejected), 5);

    public static readonly FriendRequestStatus Accepted = new(nameof(Accepted), 6);
    public static readonly FriendRequestStatus SentRemoval = new(nameof(SentRemoval), 7);
    public static readonly FriendRequestStatus ReceivedRemoval = new(nameof(ReceivedRemoval), 8);

    private FriendRequestStatus(string name, int value)
        : base(name, value) { }
}
