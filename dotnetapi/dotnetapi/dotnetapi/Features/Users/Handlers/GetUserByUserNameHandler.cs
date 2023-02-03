﻿using dotnetapi.Data;
using dotnetapi.Models.Entities;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.Users.Handlers;

public record GetUserByUserNameQuery(string UserName) : IRequest<AppUser?>;

public class
    GetUserByUserNameHandler : IRequestHandler<GetUserByUserNameQuery, AppUser?>
{
    private readonly IDataContext _context;

    public GetUserByUserNameHandler(IDataContext context)
    {
        _context = context;
    }

    public async ValueTask<AppUser?>
        Handle(GetUserByUserNameQuery request, CancellationToken cT)
    {
        return await _context.Users
            .SingleOrDefaultAsync(x => x.UserName == request.UserName, cT);
    }
}