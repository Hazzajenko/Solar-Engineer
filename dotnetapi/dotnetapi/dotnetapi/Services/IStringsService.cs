using dotnetapi.Contracts.Requests;
using dotnetapi.Models.Dtos;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Services;

public interface IStringsService
{
    Task<StringDto> CreateStringAsync(String request, int projectId);
    Task<StringDto?> GetStringByIdAsync(string id);

    Task<IEnumerable<StringDto>> GetAllStringsByProjectIdAsync(int projectId);

    Task<bool> UpdateStringAsync(UpdateStringRequest request);
    Task<bool> DeleteAsync(string stringId);
}