using Infrastructure.Repositories;
using Projects.API.Data;

namespace Projects.API.Repositories.Strings;

public sealed class StringsRepository
    : GenericRepository<ProjectsContext, String>,
        IStringsRepository
{
    public StringsRepository(ProjectsContext context)
        : base(context)
    {
    }
}