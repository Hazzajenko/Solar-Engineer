using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Services;

public interface IPanelsService
{
    Task<PanelDto> CreatePanel(Panel request, CancellationToken cancellationToken);
}