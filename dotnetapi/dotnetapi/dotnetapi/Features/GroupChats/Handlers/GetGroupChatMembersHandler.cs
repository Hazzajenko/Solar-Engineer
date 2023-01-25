﻿using dotnetapi.Data;
using dotnetapi.Features.GroupChats.Entities;
using dotnetapi.Features.GroupChats.Mapping;
using Mediator;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Features.GroupChats.Handlers;

public sealed record GetGroupChatMembersQuery
    (IEnumerable<int> GroupChatIds) : IRequest<IEnumerable<GroupChatMemberDto>>;

public class GetGroupChatMembersHandler : IRequestHandler<GetGroupChatMembersQuery, IEnumerable<GroupChatMemberDto>>
{
    private readonly ILogger<GetGroupChatMembersHandler> _logger;
    private readonly IServiceScopeFactory _scopeFactory;

    public GetGroupChatMembersHandler(IServiceScopeFactory scopeFactory, ILogger<GetGroupChatMembersHandler> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    public async ValueTask<IEnumerable<GroupChatMemberDto>>
        Handle(GetGroupChatMembersQuery request, CancellationToken cT)
    {
        using var scope = _scopeFactory.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<DataContext>();

        return await db.GroupChats
            .Where(x => request.GroupChatIds.Contains(x.Id))
            .Include(x => x.AppUserGroupChats)
            .ThenInclude(x => x.AppUser)
            .SelectMany(x => x.AppUserGroupChats)
            .Select(x => x.ToMemberDto())
            .ToListAsync(cT);
    }
}