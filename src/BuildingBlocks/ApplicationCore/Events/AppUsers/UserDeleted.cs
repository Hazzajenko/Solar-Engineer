namespace ApplicationCore.Events.AppUsers;

public record UserDeleted(
    Guid Id, string UserName, string DisplayName, string PhotoUrl);