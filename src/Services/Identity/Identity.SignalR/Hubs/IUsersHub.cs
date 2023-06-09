using Identity.Contracts.Data;
using Identity.Contracts.Responses.Friends;
using Identity.SignalR.Handlers.AppUsers;

namespace Identity.SignalR.Hubs;

public interface IUsersHub
{
    Task UserIsOnline(ConnectionDto connection);
    Task UserIsOffline(ConnectionDto connection);
    Task GetOnlineUsers(IEnumerable<ConnectionDto> connections);
    Task GetOnlineFriends(GetOnlineFriendsResponse response);

    Task ReceiveSearchForAppUserByUserNameResponse(SearchForAppUserByUserNameResponse response);
    /*Task GetOnlineFriendRequests(GetOnlineFriendRequestsResponse response);
    
    Task SendFriendRequest(SendFriendRequestResponse response);
    
    Task AcceptFriendRequest(AcceptFriendRequestResponse response);
    
    Task DeclineFriendRequest(DeclineFriendRequestResponse response);
    
    Task RemoveFriend(RemoveFriendResponse response);
    
    Task BlockUser(BlockUserResponse response);
    
    Task UnblockUser(UnblockUserResponse response);
    
    Task SendPrivateMessage(SendPrivateMessageResponse response);*/
}