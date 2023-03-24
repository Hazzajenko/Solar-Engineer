using Projects.Domain.Contracts.Data;

namespace Projects.Domain.Contracts.Responses.Admin;

public class GenerateProjectMembersResponse
{
    public IEnumerable<AppUserProjectDto> AppUserProjects { get; set; } = default!;
}