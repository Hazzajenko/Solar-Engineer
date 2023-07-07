using ApplicationCore.Extensions;
using FastEndpoints;
using Identity.Application.Logging;
using Identity.Application.Mapping;
using Identity.Application.Queries.AppUsers;
using Identity.Contracts.Data;
using Identity.Contracts.Responses;
using Identity.Domain;
using Infrastructure.Extensions;
using Mediator;

namespace Identity.API.Endpoints.Users;
public class GetUserByIdEndpoint : EndpointWithoutRequest<AppUserDto>
{
    private readonly IMediator _mediator;

    public GetUserByIdEndpoint(IMediator mediator)
    {
        _mediator = mediator;
    }

    public override void Configure()
    {
        Get("/user/{appUserId}");
        AuthSchemes("bearer");
    }

    public override async Task HandleAsync(CancellationToken cT)
    {
        AppUser? appUser = await _mediator.Send(new GetAppUserQuery(User), cT);
        if (appUser is null)
        {
            Logger.LogUserNotFound(User.GetUserId(), User.GetUserName());
            await SendUnauthorizedAsync(cT);
            return;
        }

        var userQueryId = Route<string>("appUserId");
        if (userQueryId is null)
        {
            Logger.LogError("Unable to find appUserId in route");
            ThrowError("Unable to find appUserId in route");
            await SendNoContentAsync(cT);
            return;
        }

        AppUserDto? userByQuery = await _mediator.Send(new GetAppUserDtoByIdQuery(userQueryId.ToGuid()), cT);
        if (userByQuery is null)
        {
            Logger.LogUserNotFound(userQueryId);
            await SendNoContentAsync(cT);
            return;
        }

        Response = userByQuery;
        await SendOkAsync(Response, cT);
    }
}
