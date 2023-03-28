﻿using Infrastructure.Repositories;
using Projects.Domain.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.PanelLinks;

public interface IPanelLinksRepository : IGenericRepository<PanelLink>
{
    Task<IEnumerable<PanelLinkDto>> GetPanelLinksByProjectIdAsync(Guid projectId);
}