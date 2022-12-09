using dotnetapi.Data;
using dotnetapi.Mapping;
using dotnetapi.Models.Dtos;
using dotnetapi.Models.Entities;

namespace dotnetapi.Repositories;

public class PanelsRepository : IPanelsRepository
{
    private readonly DataContext _context;

    public PanelsRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<Panel?> GetById(string panelId, CancellationToken cancellationToken)
    {
        return await _context.Panels.FindAsync(panelId, cancellationToken);
    }

    public async Task<PanelDto> CreatePanel(Panel request, CancellationToken cancellationToken)
    {
        await _context.Panels.AddAsync(request, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return request.ToDto();
    }
}