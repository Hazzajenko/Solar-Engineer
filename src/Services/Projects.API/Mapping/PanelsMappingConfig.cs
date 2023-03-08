using System.Globalization;
using System.Text.Json;
using Mapster;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Contracts.Data;
using Projects.API.Contracts.Requests.Panels;
using Projects.API.Contracts.Requests.Projects;
using Projects.API.Contracts.Responses;
using Projects.API.Entities;
using Projects.API.Handlers.Panels.CreatePanel;

namespace Projects.API.Mapping;

// Guid projectId,
//     Guid stringId,
// Guid panelConfigId

public class PanelsMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        /*config
            .NewConfig<(CreatePanelRequest Request, HubCallerContext Context), CreatePanelCommand>()
            .Map(dest => dest.Request, src => src.Request)
            .Map<ClaimsPrincipal, HubCallerContext>(dest => dest.User, src => src.Context);*/

        // .Map(dest => dest.ProjectId, src => src.projectId)
        /*config.NewConfig< (CreatePanelRequest Request, Guid projectId, Guid stringId, Guid panelConfigId), CreatePanelCommand>()
            .Map(dest => dest.ProjectId, src => src.projectId)*/

        config
            .NewConfig<(Entities.Panel Panel, string RequestId), PanelCreatedResponse>()
            .Map(dest => dest.RequestId, src => src.RequestId)
            .Map(dest => dest.ProjectId, src => src.Panel.ProjectId.ToString())
            .Map(dest => dest.Time, src => src.Panel.CreatedTime)
            .Map(dest => dest.ByAppUserId, src => src.Panel.CreatedById.ToString())
            .Map(dest => dest.Action, src => "Create")
            .Map(dest => dest.Model, src => "Panel")
            .Map(dest => dest.Create, src => src.Panel.Adapt<PanelDto>());

        config
            .NewConfig<(Entities.Panel Panel, string RequestId), ProjectEventResponse>()
            .Map(dest => dest.RequestId, src => src.RequestId)
            .Map(dest => dest.ProjectId, src => src.Panel.ProjectId.ToString())
            .Map(dest => dest.ServerTime, src => src.Panel.CreatedTime)
            .Map(dest => dest.ByAppUserId, src => src.Panel.CreatedById.ToString())
            .Map(dest => dest.Action, src => "Create")
            .Map(dest => dest.Model, src => "Panel")
            .Map(
                dest => dest.Data,
                src =>
                    JsonSerializer.Serialize(
                        src.Panel.Adapt<PanelDto>(),
                        JsonSerializerOptions.Default
                    )
            );

        // NewProjectEventRequest
        // create a map from NewProjectEventRequest to CreatePanelCommand
        config
            .NewConfig<
                (NewProjectEventRequest Request, HubCallerContext Context),
                CreatePanelCommand
            >()
            .Map(
                dest => dest.Request,
                src =>
                    JsonSerializer.Deserialize<CreatePanelRequest>(
                        src.Request.Data,
                        // JsonSerializerOptions.Default
                        new JsonSerializerOptions
                        {
                            PropertyNameCaseInsensitive = true
                        }
                    )
            )
            .Map(dest => dest.User, src => src.Context.ToHubAppUser())
            .Map(dest => dest.RequestId, src => src.Request.RequestId);

        config
            .NewConfig<PanelCreatedResponse, IEnumerable<PanelCreatedResponse>>()
            .Map(dest => dest, src => new[] { src });

        config
            .NewConfig<Panel, PanelDto>()
            .Map(dest => dest.Id, src => src.Id.ToString())
            .Map(dest => dest.ProjectId, src => src.ProjectId.ToString())
            .Map(dest => dest.PanelConfigId, src => src.PanelConfigId.ToString())
            .Map(dest => dest.StringId, src => src.StringId.ToString())
            .Map(dest => dest.CreatedById, src => src.CreatedById.ToString())
            .Map(
                dest => dest.CreatedTime,
                src => src.CreatedTime.ToString(CultureInfo.CurrentCulture)
            )
            .Map(dest => dest.Location, src => src.Location)
            .Map(dest => dest.Rotation, src => src.Rotation)
            .Map(
                dest => dest.LastModifiedTime,
                src => src.LastModifiedTime.ToString(CultureInfo.CurrentCulture)
            );
    }
}