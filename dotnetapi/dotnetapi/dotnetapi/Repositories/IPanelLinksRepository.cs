﻿using dotnetapi.Models.Entities;

namespace dotnetapi.Repositories;

public interface IPanelLinksRepository
{
    Task<PanelLink> CreatePanelLinkAsync(PanelLink request);
    Task<PanelLink?> GetPanelLinkByIdAsync(string panelLinkId);
    Task<IEnumerable<PanelLink>> GetAllPanelLinksByProjectIdAsync(int projectId);
    Task<bool> DeletePanelLinkAsync(string panelLinkId);
}