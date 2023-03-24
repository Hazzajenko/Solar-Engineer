namespace Projects.Domain.Contracts.Data;

public class PanelUpdate
{
    public required string Id { get; set; }
    public required PanelChanges Changes { get; set; }
}