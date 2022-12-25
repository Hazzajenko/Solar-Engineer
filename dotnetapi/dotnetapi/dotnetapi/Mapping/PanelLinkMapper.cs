using dotnetapi.Contracts.Requests;
using dotnetapi.Models.Dtos.Projects;
using dotnetapi.Models.Entities;

namespace dotnetapi.Mapping;

public static class PanelLinkMapper
{
    public static PanelLink ToEntity(this CreatePanelLinkRequest request)
    {
        return new PanelLink
        {
            Id = request.Id,
            StringId = request.StringId,
            PositiveToId = request.PositiveToId,
            NegativeToId = request.NegativeToId,
            IsDisconnectionPoint = request.IsDisconnectionPoint,
            DisconnectionPointPanelId = request.DisconnectionPointPanelId
        };
    }

    public static PanelLinkDto ToDto(this PanelLink request)
    {
        return new PanelLinkDto
        {
            Id = request.Id,
            ProjectId = request.Project.Id,
            StringId = request.String.Id,
            PositiveToId = request.PositiveTo.Id,
            NegativeToId = request.NegativeTo.Id,
            IsDisconnectionPoint = request.IsDisconnectionPoint,
            DisconnectionPointPanelId = request.DisconnectionPointPanelId,
            Type = EntityTypeDto.Link
        };
    }
}