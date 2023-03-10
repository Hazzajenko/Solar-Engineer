using Infrastructure.SignalR;
using Mediator;

namespace Projects.API.Handlers.Projects.GetProject;

public sealed record GetProjectByIdQuery(HubAppUser User, string ProjectId) : IQuery<bool>;