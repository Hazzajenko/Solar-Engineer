using Infrastructure.Repositories;
using Projects.Contracts.Data;

namespace Projects.Application.Repositories.Strings;

public interface IStringsRepository : IGenericRepository<String>
{
    Task<IEnumerable<StringDto>> GetStringsByProjectIdAsync(Guid projectId);
    Task<String?> GetStringByNameAsync(string name);

    Task<String?> GetUndefinedStringByProjectIdAsync(Guid projectId);

    // Task<String> GetOrCreateUndefinedStringAsync(Guid projectId);
    Task<String> GetByIdAndProjectIdAsync(Guid stringId, Guid projectId);
    Task<bool> DeleteStringByIdAndProjectIdAsync(Guid id, Guid projectId);
}