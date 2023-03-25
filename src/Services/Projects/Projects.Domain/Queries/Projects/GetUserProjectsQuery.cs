using Infrastructure.Authentication;

namespace Projects.Domain.Queries.Projects;

public sealed record GetUserProjectsQuery(AuthUser User) : IQuery<bool>;