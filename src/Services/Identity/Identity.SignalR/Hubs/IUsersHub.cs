using Identity.Contracts.Data;
using Identity.Contracts.Responses.Connections;
using Identity.Contracts.Responses.Friends;
using Identity.Contracts.Responses.Notifications;
using Identity.SignalR.Commands.AppUsers;

namespace Identity.SignalR.Hubs;

public interface IUsersHub
{
    Task AppUserIsConnected();
    Task UserIsOnline(UserIsOnlineResponse response);
    Task UserIsOffline(UserIsOfflineResponse response);
    Task GetOnlineUsers(GetOnlineUsersResponse response);
    Task GetOnlineFriends(GetOnlineFriendsResponse response);
    Task ReceiveFriend(ReceiveFriendResponse response);
    Task FriendRemoved(FriendRemovedResponse response);
    Task GetUserFriends(GetUserFriendsResponse response);

    Task ReceiveSearchForAppUserByUserNameResponse(SearchForAppUserByUserNameResponse response);
    Task ReceiveFriendRequestEvent(FriendRequestResponse response);
    Task ReceiveAppUserNotifications(ReceiveAppUserNotificationsResponse response);
    Task NotificationUpdated(UpdateNotificationResponse response);
    Task ReceiveNotification(NotificationDto response);
    Task UpdateNotification(NotificationDto response);
}
