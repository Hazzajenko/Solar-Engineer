using Identity.Domain;

namespace Identity.Contracts.Responses.Friends;

public class FriendRequestResponse
{
    public FriendRequestResponse(Guid fromAppUserId, string fromAppUserUsername, string @event)
    {
        FromAppUserId = fromAppUserId;
        FromAppUserUsername = fromAppUserUsername;
        Event = @event;
    }

    public Guid FromAppUserId { get; set; }
    public string FromAppUserUsername { get; set; }
    public string Event { get; set; }

    public static class Status
    {
        public const string Received = "FRIEND_REQUEST_RECEIVED";
        public const string Accepted = "FRIEND_REQUEST_ACCEPTED";
        public const string Rejected = "FRIEND_REQUEST_REJECTED";
    }
}
