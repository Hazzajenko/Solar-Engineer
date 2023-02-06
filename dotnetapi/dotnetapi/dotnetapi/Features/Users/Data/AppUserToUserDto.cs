using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Users.Data;

public class AppUserToUserDto
{
    public int Id { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string NickName { get; set; } = default!;
    public DateTime? BecameFriendsTime { get; set; }
    public bool IsFriend { get; set; }
    public UserToUserStatus UserToUserStatus { get; set; }
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime Created { get; set; }
    public DateTime LastActive { get; set; }
    public bool LatestSeenByAppUser { get; set; }

    public string ToUserStatusEvent { get; set; } = default!;

    public DateTime ToUserStatusDate { get; set; } = default!;
    // public string AppUserReceivedToUserStatus { get; set; } = default!;
}