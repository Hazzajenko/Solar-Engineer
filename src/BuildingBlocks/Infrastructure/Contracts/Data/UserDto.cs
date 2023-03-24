﻿using Infrastructure.Common.User;

namespace Infrastructure.Contracts.Data;

public class UserDto : IUser
{
    public Guid Id { get; set; }
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string DisplayName { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}