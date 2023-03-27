using Infrastructure.Authentication;
using Projects.Domain.Contracts.Data;

namespace Projects.Domain.Queries.Projects;

public sealed record GetUserProjectsQuery(AuthUser User) : IQuery<IEnumerable<ProjectDto>>;