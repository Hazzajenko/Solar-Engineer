using Infrastructure.Repositories;
using Projects.API.Contracts.Data;

namespace Projects.API.Repositories.Strings;

public interface IStringsRepository : IGenericRepository<String>
{
    Task<IEnumerable<StringDto>> GetStringsByProjectIdAsync(Guid projectId);
    Task<String?> GetStringByNameAsync(string name);

    Task<String?> GetUndefinedStringByProjectIdAsync(Guid projectId);

    // Task<String> GetOrCreateUndefinedStringAsync(Guid projectId);
    Task<String> GetByIdAndProjectIdAsync(Guid id, Guid projectId);
    Task<bool> DeleteStringByIdAndProjectIdAsync(Guid id, Guid projectId);
}