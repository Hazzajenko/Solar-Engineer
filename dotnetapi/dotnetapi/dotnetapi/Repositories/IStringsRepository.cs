using dotnetapi.Contracts.Requests;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Repositories;

public interface IStringsRepository
{
    Task<String> CreateStringAsync(String request);
    Task<String?> GetStringByIdAsync(string stringId);

    Task<IEnumerable<String>> GetAllStringsByProjectIdAsync(int projectId);

    Task<bool> UpdateStringAsync(UpdateStringRequest request);
    Task<bool> DeleteStringAsync(String request);
}