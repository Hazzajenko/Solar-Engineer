using System.ComponentModel.DataAnnotations;

namespace dotnetapi.Contracts.Requests.Projects;

public class UpdateProjectRequest
{
    [Required] public int Id { get; set; } = default!;

    [Required] public ProjectChanges Changes { get; set; } = default!;
}

public class ProjectChanges
{
    public string? Name { get; set; } = default!;
}