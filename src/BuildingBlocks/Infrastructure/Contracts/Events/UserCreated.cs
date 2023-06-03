namespace Infrastructure.Contracts.Events;

public record UserCreated(
    Guid Id, string UserName, string DisplayName, string PhotoUrl);