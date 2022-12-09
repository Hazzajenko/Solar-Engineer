﻿namespace dotnetapi.Models.Dtos;

public class AppUserDto {
    public string Username { get; set; } = default!;
    public string FirstName { get; init; } = default!;
    public string LastName { get; init; } = default!;
    public string Email { get; init; } = default!;
    public string PhotoUrl { get; set; } = default!;
    public DateTime Created { get; init; } = default!;
    public DateTime LastActive { get; init; } = default!;
    public string Token { get; set; } = default!;
}