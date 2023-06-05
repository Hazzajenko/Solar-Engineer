using Infrastructure.Repositories;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Projects.Application.Data;
using Projects.Application.Mapping;
using Projects.Domain.Contracts.Data;

namespace Projects.Application.Repositories.Strings;

public sealed class StringsRepository
    : GenericRepository<ProjectsContext, String>,
        IStringsRepository
{
    public StringsRepository(ProjectsContext context)
        : base(context)
    {
    }

    public async Task<IEnumerable<StringDto>> GetStringsByProjectIdAsync(Guid projectId)
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId)
            .Select(x => x.ToDto())
            .ToListAsync();
    }

    public async Task<String?> GetStringByNameAsync(string name)
    {
        return await Queryable.FirstOrDefaultAsync(x => x.Name == name);
    }

    public async Task<String?> GetUndefinedStringByProjectIdAsync(Guid projectId)
    {
        return await Queryable.FirstOrDefaultAsync(
            x => x.Name == String.UndefinedStringName && x.ProjectId == projectId
        );
    }

    /*public async Task<String> GetOrCreateUndefinedStringAsync(Guid projectId)
    {
        var undefinedString = await Queryable.FirstOrDefaultAsync(
            x => x.Name == "undefined" && x.ProjectId == projectId
        );

        if (undefinedString is not null)
            return undefinedString;

        undefinedString = new String
        {
            Name = "undefined",
            Color = "#808080",
            Parallel = false,
            ProjectId = projectId,
            CreatedById = projectId
        };

        await AddAsync(undefinedString);
        // SaveC

        return undefinedString;
    }*/

    public async Task<String> GetByIdAndProjectIdAsync(Guid id, Guid projectId)
    {
        return await Queryable
            .Where(x => x.ProjectId == projectId && x.Id == id)
            // .Select(x => x.ToDto())
            .SingleOrDefaultAsync() ?? throw new HubException("String not found");
    }

    public async Task<bool> DeleteStringByIdAndProjectIdAsync(Guid id, Guid projectId)
    {
        var @string = await Queryable.SingleOrDefaultAsync(
            x => x.Id == id && x.ProjectId == projectId
        );
        if (@string is null)
            return false;

        await Queryable.Where(x => x.Id == id && x.ProjectId == projectId).ExecuteDeleteAsync();

        await SaveChangesAsync();

        return true;
    }
}