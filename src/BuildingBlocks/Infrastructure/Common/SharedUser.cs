using Infrastructure.Common.User;

namespace Infrastructure.Common;

public abstract class SharedUser : Entity, IUser
{
    public DateTime LastActiveTime { get; set; }
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
}

/*
public abstract class SharedUserNoId : IUser
{
    public Guid Id { get; set; }
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
    public DateTime LastActiveTime { get; set; }
}*/