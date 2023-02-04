using dotnetapi.Features.Users.Data;
using dotnetapi.Features.Users.Mapping;
using dotnetapi.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Extensions;

public static class MappingExtensions
{
    public static Task<List<AppUserLinkDto>> ProjectToDtoListAsync(
        this IQueryable<AppUserLink> query
    )
    {
        return query.Select(x => x.ToDto()).ToListAsync();
    }
}