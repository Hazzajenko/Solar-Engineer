using Infrastructure.SignalR;
using Mediator;

namespace Projects.API.Handlers.Projects.GetManyProjects;

public sealed record GetManyProjectsQuery(HubAppUser User) : IQuery<bool>;