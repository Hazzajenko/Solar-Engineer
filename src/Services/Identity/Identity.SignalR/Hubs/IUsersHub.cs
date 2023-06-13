using Identity.Contracts.Data;
using Identity.Contracts.Responses.Friends;
using Identity.Contracts.Responses.Notifications;
using Identity.SignalR.Commands.AppUsers;

namespace Identity.SignalR.Hubs;

public interface IUsersHub
{
    Task UserIsOnline(ConnectionDto connection);
    Task UserIsOffline(ConnectionDto connection);
    Task GetOnlineUsers(IEnumerable<ConnectionDto> connections);
    Task GetOnlineFriends(GetOnlineFriendsResponse response);
    Task ReceiveFriend(FriendDto response);
    Task FriendRemoved(string friendId);
    Task GetUserFriends(GetUserFriendsResponse response);

    Task ReceiveSearchForAppUserByUserNameResponse(SearchForAppUserByUserNameResponse response);
    Task ReceiveFriendRequestEvent(FriendRequestResponse response);
    Task ReceiveAppUserNotifications(ReceiveAppUserNotificationsResponse response);
    Task NotificationUpdated(UpdateNotificationResponse response);
    Task ReceiveNotification(NotificationDto response);
    Task UpdateNotification(NotificationDto response);
}
