﻿using Identity.Domain;
using Mediator;
using Microsoft.AspNetCore.Http;

namespace Identity.Application.Commands;

public record AuthorizeCommand(HttpContext HttpContext) : IRequest<ExternalSigninResponse>;

public class ExternalSigninResponse
{
    public AppUser AppUser { get; set; } = default!;
    public string LoginProvider { get; set; } = default!;
}