namespace Infrastructure.Common.User;

public interface IMinimalUser
{
    Guid Id { get; set; }
    string UserName { get; set; }
    string DisplayName { get; init; }
    string PhotoUrl { get; set; }
    DateTime CreatedTime { get; set; }
    DateTime LastModifiedTime { get; set; }
}