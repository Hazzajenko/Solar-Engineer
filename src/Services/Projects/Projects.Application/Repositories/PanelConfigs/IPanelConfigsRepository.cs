﻿using Infrastructure.Repositories;
using Projects.Domain.Entities;

namespace Projects.Application.Repositories.PanelConfigs;

public interface IPanelConfigsRepository : IGenericRepository<PanelConfig>
{
    Task<PanelConfig> GetDefaultPanelConfigAsync();
    Task<PanelConfig> GetByIdNotNullAsync(Guid id);
}