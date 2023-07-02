using ApplicationCore.Entities;
using Infrastructure.Authentication;
using Projects.Contracts.Responses.Projects;

namespace Projects.SignalR.Queries.Projects;

public sealed record GetProjectByIdQuery(AuthUser User, string ProjectId)
    : IQuery<GetProjectByIdResponse>;
