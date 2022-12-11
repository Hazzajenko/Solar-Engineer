using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Contracts.Requests;

public class CreateProjectRequest
{
    [Required] public string Name { get; init; } = default!;
}
