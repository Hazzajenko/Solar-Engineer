using System.Linq.Expressions;
using ApplicationCore.Extensions;
using Infrastructure.Extensions;
using Projects.Contracts.Data;
using Projects.Domain.Common;
using Projects.Domain.Entities;

namespace Projects.Application.Mapping;

public static class PanelsMapping
{
    /*public static Panel ToDomain(
        this CreatePanelRequest request,
        Guid projectId,
        Guid stringId,
        Guid panelConfigId
    )
    {
        /*return new Panel
        {
            StringId = stringId,
            PanelConfigId = panelConfigId,
            ProjectId = projectId
        };#1#
    }*/

    public static IEnumerable<ProjectItemUpdate> ToUpdatedStringResponse(
        this IEnumerable<Panel> panels
    )
    {
        return panels.Select(
            x =>
                new ProjectItemUpdate
                {
                    Id = x.Id.ToString(),
                    Changes = new()
                    {
                        { nameof(Panel.StringId).ToCamelCase(), x.StringId.ToString() }
                    }
                }
        );
    }

    public static PanelProjectItemUpdateDictionary ToUpdateDictionary2(
        this Panel updatedPanel,
        params Expression<Func<Panel, object>>[] propertySelectors
    )
    {
        var dictionary = new PanelProjectItemUpdateDictionary { Id = updatedPanel.Id.ToString() };

        foreach (var selector in propertySelectors)
        {
            var propertyName = ((MemberExpression)selector.Body).Member.Name;
            var propertyValue = selector.Compile().Invoke(updatedPanel);
            dictionary.Changes.Add(propertyName, propertyValue);
        }

        return dictionary;
    }

    public static PanelProjectItemUpdateDictionary ToUpdateDictionary(
        this Panel updatedPanel,
        Panel originalPanel
    )
    {
        var changesDictionary = new PanelProjectItemUpdateDictionary
        {
            Id = originalPanel.Id.ToString()
        };

        foreach (var propertyInfo in typeof(Panel).GetProperties())
        {
            var originalPanelProp = originalPanel.GetType().GetProperty(propertyInfo.Name);
            var updatedPanelProp = updatedPanel.GetType().GetProperty(propertyInfo.Name);
            if (originalPanelProp is null && updatedPanelProp is null)
            {
                continue;
            }
            if (originalPanelProp == updatedPanelProp)
                continue;
            changesDictionary.Changes.Add(nameof(updatedPanelProp), updatedPanelProp);
        }

        return changesDictionary;
    }

    public static PanelDto ToDto(this Panel panel)
    {
        return new PanelDto
        {
            Id = panel.Id.ToString(),
            // ProjectId = panel.ProjectId.ToString(),
            Location = panel.Location,
            CreatedTime = panel.CreatedTime,
            PanelConfigId = panel.PanelConfigId.ToString(),
            StringId = panel.StringId.ToString(),
            LastModifiedTime = panel.LastModifiedTime,
            CreatedById = panel.CreatedById.ToString()
        };
    }

    public static IEnumerable<PanelDto> ToDtoList(this Panel panel)
    {
        return new List<PanelDto> { panel.ToDto() };
    }

    public static Panel ToEntity(
        this PanelTemplateItem panelTemplateItem,
        Guid projectId,
        Guid createdById
    )
    {
        return Panel.Create(
            panelTemplateItem.Id.ToGuid(),
            projectId,
            panelTemplateItem.StringId.ToGuid(),
            panelTemplateItem.PanelConfigId.ToGuid(),
            panelTemplateItem.Location,
            panelTemplateItem.Angle,
            createdById
        );
    }

    public static IEnumerable<Panel> ToEntityList(
        this IEnumerable<PanelTemplateItem> panelTemplateItems,
        Guid projectId,
        Guid createdById
    )
    {
        return panelTemplateItems.Select(x => x.ToEntity(projectId, createdById));
    }

    public static Panel ToEntity(this PanelDto panelDto, Guid projectId, Guid createdById)
    {
        return Panel.Create(
            panelDto.Id.ToGuid(),
            projectId,
            panelDto.StringId.ToGuid(),
            panelDto.PanelConfigId.ToGuid(),
            panelDto.Location,
            panelDto.Angle,
            createdById
        );
    }

    /*public static Panel ToDomain(this UpdatePanelRequest request)
    {
        return new Panel { Id = request.Id, Name = request.Name };
    }*/

    /*public static PanelDto ToDto(this Panel panel)
    {
        return new PanelDto
        {
            Id = panel.Id.ToString(),
            Name = panel.Name,
            ProjectId = panel.ProjectId.ToString(),
            CreatedAt = panel.CreatedTime
        };
    }*/
}
/*{
    public static Project ToDomain(this CreateProjectRequest request, Guid appUserId)
    {
        return new Project
        {
            Name = request.Name,
            CreatedById = appUserId,
            AppUserProjects = new List<AppUserProject>
            {
                new()
                {
                    AppUserId = appUserId,
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
            CreatedAt = request.Project.CreatedTime
        };
    }
}*/
