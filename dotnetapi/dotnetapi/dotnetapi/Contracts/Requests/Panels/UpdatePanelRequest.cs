using System.ComponentModel.DataAnnotations;
using dotnetapi.Models.Dtos.Projects;

namespace dotnetapi.Contracts.Requests.Panels;

public class UpdatePanelRequest
{
    [Required] public string Id { get; set; } = default!;

    [Required] public UpdatePanel Changes { get; set; } = default!;
}