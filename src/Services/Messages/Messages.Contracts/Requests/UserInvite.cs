namespace Messages.Contracts.Requests;

public class UserInvite
{
    public required string UserId { get; set; } = default!;

    public string Role { get; set; } = "Member";
}