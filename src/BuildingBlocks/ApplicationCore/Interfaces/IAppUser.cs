namespace ApplicationCore.Interfaces;

public interface IAppUser
{
    Guid Id { get; set; }
    string FirstName { get; init; }
    string LastName { get; init; }
    string UserName { get; set; }
    string DisplayName { get; init; }
    string PhotoUrl { get; set; }
    DateTime CreatedTime { get; set; }
    DateTime LastModifiedTime { get; set; }
}
