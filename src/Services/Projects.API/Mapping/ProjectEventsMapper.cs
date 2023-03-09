using System.Text.Json;
using Infrastructure.Extensions;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Projects;

namespace Projects.API.Mapping;

public static class ProjectEventsMapper
{
    public static TCommand ToCommand<TCommand, TRequestTo>(
        this ProjectEvent projectEvent,
        HubCallerContext context
    )
        where TCommand : IProjectCommand<TRequestTo>, new()
        where TRequestTo : class
    {
        var fromJson =
            JsonSerializer.Deserialize<TRequestTo>(
                projectEvent.Data,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            ) ?? throw new JsonException("Could not deserialize request data");
        return new TCommand
        {
            User = context.ToHubAppUser(),
            Request = fromJson,
            RequestId = projectEvent.RequestId
        };
    }

    public static object ToCommandObject(
        this ProjectEvent projectEvent,
        HubCallerContext context
    )
    {
        var requestType = projectEvent.ToRequestType();
        var eventRequest = (IProjectEventRequest)
            JsonSerializer.Deserialize(projectEvent.Data, requestType, new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            })!;

        var commandType = projectEvent.ToCommandType();
        var command = Activator.CreateInstance(commandType)!;

        var commandProperty = commandType.GetProperty("Request")!;
        commandProperty.SetValue(command, eventRequest);
        var userProperty = commandType.GetProperty("User")!;
        userProperty.SetValue(command, context.ToHubAppUser());
        var requestIdProperty = commandType.GetProperty("RequestId")!;
        requestIdProperty.SetValue(command, projectEvent.RequestId);
        return command;
    }


    private static Type ToCommandType(this ProjectEvent request)
    {
        var model = request.Model.ToPascalCase();
        var action = request.Action.ToPascalCase();

        var typeName =
            $"Projects.API.Handlers.{model}s.{action}{model}.{action}{model}Command";
        return Type.GetType(typeName) ?? throw new InvalidOperationException();
    }


    private static Type ToRequestType(this ProjectEvent request)
    {
        var model = request.Model.ToPascalCase();
        var action = request.Action.ToPascalCase();

        var typeName =
            $"Projects.API.Contracts.Requests.{model}s.{action}{model}Request";
        return Type.GetType(typeName) ?? throw new InvalidOperationException();
    }
}