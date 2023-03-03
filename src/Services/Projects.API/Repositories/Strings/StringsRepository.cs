using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;
using Projects.API.Contracts.Data;
using Projects.API.Data;
using Projects.API.Mapping;

namespace Projects.API.Repositories.Strings;

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
}