namespace Infrastructure.Contracts.Events;

public record UserUpdated(
    Guid Id, string UserName, string DisplayName, string PhotoUrl);