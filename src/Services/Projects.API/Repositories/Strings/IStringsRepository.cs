using Infrastructure.Repositories;
using Projects.API.Contracts.Data;

namespace Projects.API.Repositories.Strings;

public interface IStringsRepository : IGenericRepository<String>
{
    Task<IEnumerable<StringDto>> GetStringsByProjectIdAsync(Guid projectId);
}