using Infrastructure.Authentication;

namespace Projects.Domain.Queries.Projects;

public sealed record GetProjectByIdQuery(AuthUser User, string ProjectId) : IQuery<bool>;