using dotnetapi.Features.Conversations.Entities;
using dotnetapi.Features.Messages.Entities;
using Microsoft.AspNetCore.Identity;

namespace dotnetapi.Models.Entities;

public class AppUser : IdentityUser<int>
{
    /*public AppUser()
    {
        SentFriendRequests = new List<AppUserFriend>();
        ReceievedFriendRequests = new List<AppUserFriend>();
    }*/

    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime Created { get; set; } = DateTime.Now;
    public DateTime LastActive { get; set; } = DateTime.Now;
    public ICollection<AppUserProject> AppUserProjects { get; set; } = default!;
    public ICollection<AppUserConversation> AppUserConversations { get; set; } = default!;
    public ICollection<AppUserRole> UserRoles { get; set; } = default!;
    public ICollection<AppUserFriend> SentFriendRequests { get; set; } = default!;
    public ICollection<AppUserFriend> ReceivedFriendRequests { get; set; } = default!;

    // public ICollection<Notification> Notifications { get; set; } = default!;
    public ICollection<Message> MessagesSent { get; set; } = default!;

    public ICollection<Message> MessagesReceived { get; set; } = default!;
    // public ICollection<FriendRequestNotification> FriendRequestNotifications { get; set; } = default!;


    /*
    [NotMapped]
    public ICollection<AppUserFriend> Friends
    {
        get
        {
            var friends = SentFriendRequests.Where(x => x.Approved).ToList();
            if (friends.Count < 1)
                friends = ReceivedFriendRequests.Where(x => x.Approved).ToList();
            else
                friends.AddRange(ReceivedFriendRequests.Where(x => x.Approved));
            return friends;
        }
    }*/
}