namespace Infrastructure.Contracts.Events;

public record UserRegistered(
    Guid Id, string UserName, string DisplayName, string PhotoUrl);