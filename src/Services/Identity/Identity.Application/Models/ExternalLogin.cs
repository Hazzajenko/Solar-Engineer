﻿namespace Identity.Application.Models;

public class ExternalLogin
{
    public string LoginProvider { get; set; } = default!;
    public string ProviderKey { get; set; } = default!;
}