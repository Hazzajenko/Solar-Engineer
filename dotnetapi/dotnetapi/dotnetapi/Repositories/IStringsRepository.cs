using dotnetapi.Models.Dtos;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Repositories;

public interface IStringsRepository
{
    Task<StringDto> CreateStringAsync(String request, CancellationToken cancellationToken);
    Task<String?> GetStringByIdAsync(string stringId, CancellationToken cancellationToken);

    Task<IEnumerable<StringDto>> GetAllStringsByProjectIdAsync(int projectId,
        CancellationToken cancellationToken);

    Task<bool> UpdateStringAsync(String request, String changes, CancellationToken cancellationToken);
    Task<bool> DeleteAsync(String request, CancellationToken cancellationToken);
}