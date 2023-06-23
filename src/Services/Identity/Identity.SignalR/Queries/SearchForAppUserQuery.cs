using Identity.Contracts.Data;
using Identity.Contracts.Requests.Users;
using Identity.Contracts.Responses.Users;
using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Queries;

public record SearchForAppUserQuery(
    AuthUser AuthUser,
    SearchForAppUserRequest Request
) : IQuery<SearchForAppUserResponse>;
