using Infrastructure.SignalR;
using Mediator;

namespace Projects.API.Handlers.Projects.GetProject;

public sealed record GetProjectQuery(HubAppUser User, string ProjectId) : IQuery<bool>;