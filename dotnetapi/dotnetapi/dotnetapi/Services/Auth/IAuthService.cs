﻿using dotnetapi.Contracts.Responses.Auth;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services.Auth;

public interface IAuthService
{
    // Task<string> CreateToken(AppUser user);
    Task<LoginResponse> HandleSignIn(AppUser request);
}