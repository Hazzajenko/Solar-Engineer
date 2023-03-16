using Infrastructure.SignalR;
using Mediator;

namespace Projects.API.Handlers.Projects.GetUserProjects;

public sealed record GetUserProjectsQuery(HubAppUser User) : IQuery<bool>;