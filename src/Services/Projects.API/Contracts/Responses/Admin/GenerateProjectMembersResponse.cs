using Projects.API.Contracts.Data;

namespace Projects.API.Contracts.Responses.Admin;

public class GenerateProjectMembersResponse
{
    public IEnumerable<AppUserProjectDto> AppUserProjects { get; set; } = default!;
}