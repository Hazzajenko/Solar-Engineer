using Infrastructure.SignalR;
using Mapster;
using Microsoft.AspNetCore.SignalR;
using Projects.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Mapping;

// Guid projectId,
//     Guid stringId,
// Guid panelConfigId

public class AppUserProjectsMappingConfig : IRegister
{
    public void Register(TypeAdapterConfig config)
    {
        config
            .NewConfig<AppUserProject, ProjectDto>()
            .Map(dest => dest.Id, src => src.Project.Id.ToString())
            .Map(dest => dest.Name, src => src.Project.Name)
            .Map(dest => dest.Colour, src => src.Project.Colour)
            .Map(dest => dest.CreatedTime, src => src.Project.CreatedTime)
            .Map(dest => dest.LastModifiedTime, src => src.Project.LastModifiedTime)
            .Map(dest => dest.CreatedById, src => src.Project.CreatedById.ToString())
            .Map(
                dest => dest.MemberIds,
                src => src.Project.AppUserProjects.Select(z => z.AppUserId.ToString())
            )
            .Map(dest => dest.UndefinedStringId, src => src.Project.UndefinedStringId.ToString())
            .Map(
                dest => dest.Members,
                src =>
                    src.Project.AppUserProjects.Select(
                        z =>
                            new ProjectUserDto
                            {
                                Id = z.AppUserId.ToString(),
                                Role = z.Role,
                                CanCreate = z.CanCreate,
                                CanDelete = z.CanDelete,
                                CanInvite = z.CanInvite,
                                CanKick = z.CanKick,
                                JoinedAtTime = z.CreatedTime
                            }
                    )
            );

        config
            .NewConfig<AppUserProject, ProjectUserDto>()
            .Map(dest => dest.Id, src => src.AppUserId.ToString())
            .Map(dest => dest.Role, src => src.Role)
            .Map(dest => dest.CanCreate, src => src.CanCreate)
            .Map(dest => dest.CanDelete, src => src.CanDelete)
            .Map(dest => dest.CanInvite, src => src.CanInvite)
            .Map(dest => dest.CanKick, src => src.CanKick)
            .Map(dest => dest.JoinedAtTime, src => src.CreatedTime);
    }
}
//
// x =>
//     new ProjectDto
//     {
//         Id = x.Project.Id.ToString(),
//         Name = x.Project.Name,
//         Colour = x.Project.Colour,
//         CreatedTime = x.Project.CreatedTime,
//         LastModifiedTime = x.Project.LastModifiedTime,
//         CreatedById = x.Project.CreatedById.ToString(),
//         MemberIds = x.Project.AppUserProjects
//             .Where(c => c.AppUserId != appUserId)
//             .Select(z => z.AppUserId.ToString()),
//         Members = x.Project.AppUserProjects.Select(
//             z =>
//                 new ProjectUserDto
//                 {
//                     Id = z.AppUserId.ToString(),
//                     Role = z.Role,
//                     CanCreate = z.CanCreate,
//                     CanDelete = z.CanDelete,
//                     CanInvite = z.CanInvite,
//                     CanKick = z.CanKick,
//                     JoinedAtTime = z.CreatedTime
//                 }
//         )
//     }
