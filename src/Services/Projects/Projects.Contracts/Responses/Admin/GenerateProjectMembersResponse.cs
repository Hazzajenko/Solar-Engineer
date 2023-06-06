using Projects.Contracts.Data;

namespace Projects.Contracts.Responses.Admin;

public class GenerateProjectMembersResponse
{
    public IEnumerable<AppUserProjectDto> AppUserProjects { get; set; } = default!;
}