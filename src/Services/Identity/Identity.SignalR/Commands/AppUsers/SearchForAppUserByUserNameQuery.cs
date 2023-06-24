using ApplicationCore.Entities;
using Identity.Contracts.Data;
using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Commands.AppUsers;

/*
public class SearchForAppUserByUserNameRequest : IRequest<SearchForAppUserByUserNameResponse>
{
    public string UserName { get; set; } = string.Empty;
}
*/

public class SearchForAppUserByUserNameResponse
{
    public IEnumerable<MinimalAppUserDto> AppUsers { get; set; } = new List<MinimalAppUserDto>();
}

public record SearchForAppUserByUserNameQuery(AuthUser AuthUser, string UserName)
    : IQuery<SearchForAppUserByUserNameResponse>;
