using Projects.Domain.Entities;

namespace Projects.Domain.Common;

// public class PanelProjectItemUpdate : ProjectItemUpdate<Panel, PanelChanges> { }

public class PanelProjectItemUpdateDictionary
{
    public string Id { get; set; } = default!;
    public Dictionary<string, object?> Changes { get; set; } = default!;
}

/*public interface IPartialPanel : IProjectItemPartial<Panel>
{
    public Panel.Point? Location { get; init; }
    public string? StringId { get; set; }
    public string? PanelConfigId { get; init; }
    public double? Angle { get; init; }
}*/



public class PanelChanges
{
    public Panel.Point? Location { get; init; }
    public string? StringId { get; set; }
    public string? PanelConfigId { get; init; }
    public double? Angle { get; init; }
}

/*public PanelProjectItemUpdateDictionary DetectChanges(PanelProjectItem originalItem, PanelProjectItemUpdateModel updatedItem)
{
    var changesDictionary = new PanelProjectItemUpdateDictionary
    {
        Id = originalItem.Id
    };

    if (originalItem.Property1 != updatedItem.Property1)
    {
        changesDictionary.Changes.Add(nameof(updatedItem.Property1), updatedItem.Property1);
    }
    
    if (originalItem.Property2 != updatedItem.Property2)
    {
        changesDictionary.Changes.Add(nameof(updatedItem.Property2), updatedItem.Property2);
    }

    //... do the same for other properties

    return changesDictionary;
}*/
