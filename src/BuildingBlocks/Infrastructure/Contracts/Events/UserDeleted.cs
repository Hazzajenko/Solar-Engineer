namespace Infrastructure.Contracts.Events;

public record UserDeleted(
    Guid Id, string UserName, string DisplayName, string PhotoUrl);