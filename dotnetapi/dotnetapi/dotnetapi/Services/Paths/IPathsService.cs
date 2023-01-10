using dotnetapi.Contracts.Requests.Paths;
using dotnetapi.Models.Dtos.Projects;
using Path = dotnetapi.Models.Entities.Path;

namespace dotnetapi.Services.Paths;

public interface IPathsService
{
    Task<PathDto> CreatePathAsync(Path request, int projectId);
    Task<PathDto?> GetPathByIdAsync(string pathId);
    Task<IEnumerable<PathDto>> GetAllPathsByProjectIdAsync(int projectId);
    Task<bool> UpdatePathAsync(UpdatePathRequest request);
    Task<bool> DeletePathAsync(string pathId);
}