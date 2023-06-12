namespace Identity.Contracts.Data;

public class FriendDto
{
    public string Id { get; set; } = default!;
    public string DisplayName { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public DateTime BecameFriendsTime { get; set; }
}
