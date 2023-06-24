namespace ApplicationCore.Events.AppUsers;

public record UserRegistered(Guid Id, string UserName, string DisplayName, string PhotoUrl);
