using dotnetapi.Contracts.Requests.Paths;
using Path = dotnetapi.Models.Entities.Path;

namespace dotnetapi.Repositories.Paths;

public interface IPathsRepository
{
    Task<Path?> GetPathByIdAsync(string pathId);
    Task<Path> CreatePathAsync(Path request);

    Task<IEnumerable<Path>> GetAllPathsByProjectIdAsync(int projectId);

    Task<bool> UpdatePathAsync(UpdatePathRequest request);
    Task<bool> DeletePathAsync(string pathId);
}