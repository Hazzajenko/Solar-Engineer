using Mapster;
using Projects.Contracts.Data;
using Projects.Contracts.Requests.Projects;
using Projects.Domain.Entities;

namespace Projects.Application.Mapping;

public static class ProjectsMapping
{
    public static Project ToDomain(this CreateProjectRequest request, Guid projectUserId)
    {
        return new Project
        {
            Name = request.Name,
            CreatedById = projectUserId,
            AppUserProjects = new List<AppUserProject>
            {
                new()
                {
                    AppUserId = projectUserId,
                    Role = "Admin",
                    CanCreate = true,
                    CanDelete = true,
                    CanInvite = true,
                    CanKick = true
                }
            }
        };
    }

    public static ProjectDto ToDto(this AppUserProject request)
    {
        return new ProjectDto
        {
            Id = request.Project.Id.ToString(),
            Name = request.Project.Name,
            CreatedById = request.Project.CreatedById.ToString(),
            CreatedTime = request.Project.CreatedTime
        };
    }

    public static ProjectDto ToDto(this Project request)
    {
        return new ProjectDto
        {
            Id = request.Id.ToString(),
            Name = request.Name,
            Colour = request.Colour,
            CreatedById = request.CreatedById.ToString(),
            CreatedTime = request.CreatedTime,
            LastModifiedTime = request.LastModifiedTime,
            MemberIds = request.AppUserProjects.Select(x => x.AppUserId.ToString()),
            UndefinedStringId = request.UndefinedStringId.ToString(),
        };
    }

    public static ProjectDataDto ToDataDto(
        this Project request,
        IEnumerable<Panel> panels,
        IEnumerable<String> strings,
        IEnumerable<PanelLink> panelLinks,
        IEnumerable<PanelConfig> panelConfigs
    )
    {
        return new ProjectDataDto
        {
            Id = request.Id.ToString(),
            Name = request.Name,
            Colour = request.Colour,
            CreatedById = request.CreatedById.ToString(),
            CreatedTime = request.CreatedTime,
            LastModifiedTime = request.LastModifiedTime,
            MemberIds = request.AppUserProjects.Select(x => x.AppUserId.ToString()),
            UndefinedStringId = request.UndefinedStringId.ToString(),
            Panels = panels.Adapt<IEnumerable<PanelDto>>(),
            Strings = strings.Adapt<IEnumerable<StringDto>>(),
            PanelLinks = panelLinks.Adapt<IEnumerable<PanelLinkDto>>(),
            PanelConfigs = panelConfigs.Adapt<IEnumerable<PanelConfigDto>>(),
        };
    }

    public static ProjectDataDto ToDefaultEmptyDataDto(
        this Project request,
        String undefinedString,
        IEnumerable<PanelConfig> defaultPanelConfigs
    )
    {
        return new ProjectDataDto
        {
            Id = request.Id.ToString(),
            Name = request.Name,
            Colour = request.Colour,
            CreatedById = request.CreatedById.ToString(),
            CreatedTime = request.CreatedTime,
            LastModifiedTime = request.LastModifiedTime,
            MemberIds = request.AppUserProjects.Select(x => x.AppUserId.ToString()),
            UndefinedStringId = request.UndefinedStringId.ToString(),
            Panels = new List<PanelDto>(),
            Strings = new List<StringDto> { undefinedString.ToDto() },
            PanelLinks = new List<PanelLinkDto>(),
            PanelConfigs = defaultPanelConfigs.Select(x => x.ToDto()),
        };
    }
}
