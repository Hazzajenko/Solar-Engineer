using dotnetapi.Models.Entities;

namespace dotnetapi.Features.Users.Data;

public class AppUserLinkDto
{
    public int Id { get; set; }
    public int AppUserRequestedId { get; set; } = default!;
    public string AppUserRequestedUserName { get; set; } = default!;
    public string AppUserRequestedNickName { get; set; } = default!;
    public int AppUserReceivedId { get; set; } = default!;
    public string AppUserReceivedUserName { get; set; } = default!;
    public string AppUserReceivedNickName { get; set; } = default!;
    public DateTime Created { get; set; } = DateTime.Now;
    public DateTime? BecameFriendsTime { get; set; }
    public bool Friends { get; set; }
    public UserToUserStatus UserToUserStatus { get; set; }
    // public bool Friends { get; set; }
}

public class AppUserLinkNickNameChanges
{
    public string? AppUserRequestedNickName { get; set; } = default!;
    public string? AppUserReceivedNickName { get; set; } = default!;
}

public class AppUserLinkChanges
{
    public string? AppUserRequestedNickName { get; set; } = default!;
    public string? AppUserReceivedNickName { get; set; } = default!;
    public DateTime? BecameFriendsTime { get; set; }
    public bool? Friends { get; set; }
    public UserToUserStatus? UserToUserStatus { get; set; }
}