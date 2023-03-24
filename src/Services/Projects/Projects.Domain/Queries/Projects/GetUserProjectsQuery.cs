using Infrastructure.SignalR;

namespace Projects.Domain.Queries.Projects;

public sealed record GetUserProjectsQuery(HubAppUser User) : IQuery<bool>;