﻿namespace Identity.API.Deprecated.Contracts.Responses;

public class AuthorizeResponse
{
    // public CurrentUserDto User { get; set; } = default!;
    public string Token { get; set; } = default!;
}