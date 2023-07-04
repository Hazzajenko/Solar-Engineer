using System.Text.Json;
using System.Text.Json.Serialization;
using Humanizer;
using Microsoft.AspNetCore.SignalR;
using Projects.Contracts.Requests.Projects;
using Projects.Domain.Common;

namespace Projects.SignalR.Mapping;

public static class CommandsMapping
{
    public static IProjectCommand ToCommandObject(
        this ProjectGridEvent projectGridEvent,
        HubCallerContext context
    )
    {
        Type requestType = projectGridEvent.ToRequestType();
        var eventRequest = (IProjectEventRequest)
            JsonSerializer.Deserialize(
                projectGridEvent.Data,
                requestType,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true,
                    NumberHandling = JsonNumberHandling.AllowReadingFromString | JsonNumberHandling.WriteAsString
                }
            )!;

        Type commandType = projectGridEvent.ToCommandType();
        var command = Activator.CreateInstance(commandType)!;

        if (
            commandType.GetProperty("Request") == null
            || commandType.GetProperty("User") == null
            || commandType.GetProperty("RequestId") == null
            || commandType.GetProperty("ProjectId") == null
        )
            throw new InvalidOperationException("Command does not have all required properties");

        var commandProperty = commandType.GetProperty("Request")!;
        commandProperty.SetValue(command, eventRequest);

        var userProperty = commandType.GetProperty("User")!;
        userProperty.SetValue(command, context.ToAuthUser());
        // userProperty.SetValue(command, context.ToHubAppUser());

        var requestIdProperty = commandType.GetProperty("RequestId")!;
        requestIdProperty.SetValue(command, projectGridEvent.RequestId);

        var projectIdProperty = commandType.GetProperty("ProjectId")!;
        projectIdProperty.SetValue(command, projectGridEvent.ProjectId);

        return (IProjectCommand)command;
    }

    private static Type ToCommandType(this ProjectGridEvent request)
    {
        var action = request.Action;
        var model = request.Model;
        model = action.Contains("Many") ? model.Pluralize() : model;
        var commandName = $"{action}{model}Command";
        return ScanForCommands(typeof(IProjectCommand), commandName);
    }

    private static Type ToRequestType(this ProjectGridEvent request)
    {
        var action = request.Action;
        var model = request.Model;
        model = action.Contains("Many") ? model.Pluralize() : model;
        var requestName = $"{action}{model}Request";
        return ScanForContracts(typeof(IProjectEventRequest), requestName);
    }
}