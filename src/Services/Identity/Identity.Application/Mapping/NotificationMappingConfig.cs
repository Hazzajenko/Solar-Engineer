using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;

namespace Identity.Application.Mapping;

public class NotificationMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config
            .NewConfig<Notification, NotificationDto>()
            .Map(dest => dest.Id, src => src.Id.ToString())
            .Map(dest => dest.SenderAppUserId, src => src.SenderAppUserId.ToString())
            .Map(dest => dest.SenderAppUserUserName, src => src.SenderAppUser.UserName)
            .Map(dest => dest.SenderAppUserDisplayName, src => src.SenderAppUser.DisplayName)
            .Map(dest => dest.SenderAppUserPhotoUrl, src => src.SenderAppUser.PhotoUrl)
            .Map(dest => dest.NotificationType, src => src.NotificationType.Name)
            .Map(dest => dest.CreatedTime, src => src.CreatedTime)
            .Map(dest => dest.ReceivedByAppUser, src => src.ReceivedByAppUser)
            .Map(dest => dest.SeenByAppUser, src => src.SeenByAppUser)
            .Map(dest => dest.DeletedByAppUser, src => src.DeletedByAppUser)
            .Map(dest => dest.CancelledBySender, src => src.CancelledBySender)
            .Map(dest => dest.Completed, src => src.Completed);
    }
}
