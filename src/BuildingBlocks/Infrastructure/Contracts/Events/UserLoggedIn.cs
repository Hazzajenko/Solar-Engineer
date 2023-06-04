namespace Infrastructure.Contracts.Events;

public record UserLoggedIn(
    Guid Id, string UserName, string DisplayName, string PhotoUrl
);

public record UserLoggedInResponse(
    Guid Id, string UserName, string DisplayName, string PhotoUrl
);

public record UserFound(
    Guid Id
);

public record UserNotFound(
    Guid Id
);