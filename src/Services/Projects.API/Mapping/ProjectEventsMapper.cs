using System.Text.Json;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Projects;

namespace Projects.API.Mapping;

public static class ProjectEventsMapper
{
    public static TCommand ToCommand<TCommand, TRequestTo>(
        this NewProjectEventRequest request,
        HubCallerContext context
    )
        where TCommand : IProjectCommand<TRequestTo>, new()
        where TRequestTo : class
    {
        var fromJson =
            JsonSerializer.Deserialize<TRequestTo>(
                request.Data,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            ) ?? throw new JsonException("Could not deserialize request data");
        return new TCommand
        {
            User = context.ToHubAppUser(),
            Request = fromJson,
            RequestId = request.RequestId
        };
    }
}