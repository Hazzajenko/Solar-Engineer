namespace ApplicationCore.Events.AppUsers;

public record UserUpdated(
    Guid Id, string UserName, string DisplayName, string PhotoUrl);