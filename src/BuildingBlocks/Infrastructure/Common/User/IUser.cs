namespace Infrastructure.Common.User;

public interface IUser
{
    Guid Id { get; set; }
    string FirstName { get; init; }
    string LastName { get; init; }
    string UserName { get; set; }
    string DisplayName { get; init; }
    string PhotoUrl { get; set; }
    DateTime CreatedTime { get; set; }

    DateTime LastModifiedTime { get; set; }
    // DateTime LastActiveTime { get; set; }
}