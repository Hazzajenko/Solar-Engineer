namespace Identity.Contracts.Data;

public class AppUserLinkDto
{
    public string AppUserRequestedId { get; set; } = default!;
    public string AppUserRequestedDisplayName { get; set; } = default!;
    public string AppUserReceivedId { get; set; } = default!;
    public string AppUserReceivedDisplayName { get; set; } = default!;
    public DateTime? BecameFriendsTime { get; set; }
    public bool Friends { get; set; }
    public string AppUserRequestedStatusEvent { get; set; } = default!;
    public DateTime AppUserRequestedStatusTime { get; set; }
    public string AppUserReceivedStatusEvent { get; set; } = default!;
    public DateTime AppUserReceivedStatusTime { get; set; }
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}