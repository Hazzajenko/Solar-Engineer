namespace Infrastructure.Contracts.Events;

public record UserLoggedIn(
    Guid Id, string UserName, string DisplayName, string PhotoUrl
);