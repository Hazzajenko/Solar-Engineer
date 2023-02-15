namespace Users.API.Models;

public static class UserStatus
{
    public static class FriendRequestSent
    {
        public const string Pending = "SENT_FRIEND_REQUEST_PENDING";
        public const string Accepted = "SENT_FRIEND_REQUEST_ACCEPTED";
        public const string Rejected = "SENT_FRIEND_REQUEST_REJECTED";
    }

    public static class FriendRequestReceived
    {
        public const string Pending = "RECEIVED_FRIEND_REQUEST_PENDING";
        public const string Accepted = "RECEIVED_FRIEND_REQUEST_ACCEPTED";
        public const string Rejected = "RECEIVED_FRIEND_REQUEST_REJECTED";
    }
}