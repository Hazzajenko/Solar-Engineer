using System.Text.Json;
using Humanizer;
using Microsoft.AspNetCore.SignalR;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Requests.Projects;

namespace Projects.SignalR.Mapping;

public static class CommandsMapping
{
    public static IProjectCommand ToCommandObject(
        this ProjectEvent projectEvent,
        HubCallerContext context
    )
    {
        var requestType = projectEvent.ToRequestType();
        var eventRequest = (IProjectEventRequest)
            JsonSerializer.Deserialize(
                projectEvent.Data,
                requestType,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            )!;

        var commandType = projectEvent.ToCommandType();
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
        userProperty.SetValue(command, context.ToHubAppUser());

        var requestIdProperty = commandType.GetProperty("RequestId")!;
        requestIdProperty.SetValue(command, projectEvent.RequestId);

        var projectIdProperty = commandType.GetProperty("ProjectId")!;
        projectIdProperty.SetValue(command, projectEvent.ProjectId);

        return (IProjectCommand)command;
    }

    private static Type ToCommandType(this ProjectEvent request)
    {
        // var action = request.Action.Transform(To.TitleCase);
        // var action = request.Action.Transform(To.LowerCase, To.TitleCase);
        var action = request.Action;
        var model = request.Model;
        model = action.Contains("Many") ? model.Pluralize() : model;
        var commandName = $"{action}{model}Command";
        return ScanForType(typeof(IProjectCommand), commandName);
    }

    private static Type ToRequestType(this ProjectEvent request)
    {
        // var action = request.Action.ToPascalCase();
        // var model = request.Model.ToPascalCase();
        var action = request.Action;
        var model = request.Model;
        model = action.Contains("Many") ? model.Pluralize() : model;
        var requestName = $"{action}{model}Request";
        return ScanForType(typeof(IProjectEventRequest), requestName);
    }
}