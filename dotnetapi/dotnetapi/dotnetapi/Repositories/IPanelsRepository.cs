using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Repositories;

public interface IPanelsRepository
{
    Task<Panel?> GetById(string stringId, CancellationToken cancellationToken);
    Task<PanelDto> CreatePanel(Panel request, CancellationToken cancellationToken);
}