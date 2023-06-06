using Infrastructure.Authentication;

namespace Projects.SignalR.Queries.Projects;

public sealed record GetProjectByIdQuery(AuthUser User, string ProjectId) : IQuery<bool>;