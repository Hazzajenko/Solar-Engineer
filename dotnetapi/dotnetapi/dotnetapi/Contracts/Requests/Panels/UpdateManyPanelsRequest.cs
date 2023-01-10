using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Contracts.Requests.Panels;

public class UpdateManyPanelsRequest
{
    [Required] public IEnumerable<UpdatePanelRequest> Updates { get; init; } = Enumerable.Empty<UpdatePanelRequest>();
}