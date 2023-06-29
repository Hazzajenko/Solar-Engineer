﻿namespace ApplicationCore.Contracts.Data;

public class UserDto
{
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public Guid Id { get; set; }
    public string DisplayName { get; set; } = default!;
    public string UserName { get; set; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime CreatedTime { get; set; }
    public DateTime LastModifiedTime { get; set; }
}