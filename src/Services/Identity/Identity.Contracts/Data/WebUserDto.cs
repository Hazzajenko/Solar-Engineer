namespace Identity.Contracts.Data;

public class WebUserDto
{
    public string Id { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public bool IsFriend { get; set; }
    public DateTime? BecameFriendsTime { get; set; }
    public DateTime RegisteredAtTime { get; set; }
    public DateTime LastActiveTime { get; set; }
}
