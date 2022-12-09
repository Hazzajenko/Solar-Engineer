using dotnetapi.Models.Dtos;
using String = dotnetapi.Models.Entities.String;

namespace dotnetapi.Services;

public interface IStringsService
{
    Task<StringDto> CreateStringAsync(String request, CancellationToken cancellationToken);
}