namespace dotnetapi.Models.Entities;

public class FriendRequest : BaseEntity
{

        /*public int RequestedById { get; set; }
        public int RequestedToId { get; set; }*/
        public int RequestedById { get; set; } = default!;
        public AppUser RequestedBy { get; set; } = default!;
        public int RequestedToId { get; set; } = default!;
        public AppUser RequestedTo { get; set; } = default!;

        // public DateTime? RequestTime { get; set; }

        public DateTime? BecameFriendsTime { get; set; }

        public FriendRequestFlag FriendRequestFlag { get; set; }

        // public bool Approved => FriendRequestFlag == FriendRequestFlag.Approved;
    
}