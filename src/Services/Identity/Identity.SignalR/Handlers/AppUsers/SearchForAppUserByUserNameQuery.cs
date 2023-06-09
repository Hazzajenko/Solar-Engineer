using Identity.Contracts.Data;
using Infrastructure.Authentication;
using Mediator;

namespace Identity.SignalR.Handlers.AppUsers;

public class SearchForAppUserByUserNameRequest : IRequest<SearchForAppUserByUserNameResponse>
{
    public string UserName { get; set; } = string.Empty;
}

public class SearchForAppUserByUserNameResponse
{
    public IEnumerable<AppUserDto> AppUsers { get; set; } = new List<AppUserDto>();
}

public record SearchForAppUserByUserNameQuery
    (AuthUser AuthUser, SearchForAppUserByUserNameRequest Request) : IQuery<SearchForAppUserByUserNameResponse>;