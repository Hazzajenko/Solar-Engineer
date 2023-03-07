using Infrastructure.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;

namespace Projects.API.Mapping;

// Guid projectId,
//     Guid stringId,
// Guid panelConfigId

public class AppUsersMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config.NewConfig<HubCallerContext, HubAppUser>()
            .Map(dest => dest.Id, src => src.GetGuidUserId())
            .Map(dest => dest.ConnectionId, src => src.ConnectionId);
    }
}