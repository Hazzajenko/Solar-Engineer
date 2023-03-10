using System.Text.Json;
using Infrastructure.Extensions;
using Microsoft.AspNetCore.SignalR;
using Projects.API.Common;
using Projects.API.Contracts.Requests.Projects;
using Projects.API.Contracts.Responses;
using Projects.API.Data;
using Serilog;

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

    public static ProjectEventResponse ToProjectEventResponse<TEntity>(
        this TEntity entity,
        string appUserId,
        string requestId,
        string action,
        string model
    )
        where TEntity : IProjectItem
    {
        var toJson = JsonSerializer.Serialize(entity);
        return new ProjectEventResponse
        {
            RequestId = requestId,
            ProjectId = entity.ProjectId.ToString(),
            ByAppUserId = appUserId,
            Action = action,
            Model = model,
            Data = toJson
        };
        /*{
            User = context.ToHubAppUser(),
            Request = fromJson,
            RequestId = projectEvent.RequestId
        };*/
    }

    public static ProjectEventResponse ToProjectEventResponseV2<TEntity, TProjectCommand>(
        this TEntity entity,
        TProjectCommand command,
        string action,
        string model
    )
        where TEntity : IProjectItem
        where TProjectCommand : IProjectCommandBase
    {
        var toJson = JsonSerializer.Serialize(entity);
        return new ProjectEventResponse
        {
            RequestId = command.RequestId,
            ProjectId = entity.ProjectId.ToString(),
            ByAppUserId = command.User.Id.ToString(),
            Action = action,
            Model = model,
            Data = toJson
        };
        /*{
            User = context.ToHubAppUser(),
            Request = fromJson,
            RequestId = projectEvent.RequestId
        };*/
    }

    public static ProjectEventResponse ToProjectEventResponseV3<TEntity, TProjectCommand>(
        this TEntity entity,
        TProjectCommand command,
        string action
    )
        where TEntity : IProjectItem
        where TProjectCommand : IProjectCommandBase
    {
        var dtoType = entity.ToDtoType();
        Log.Logger.Information("dtoType: {DtoType}", dtoType);
        // var entityDto = entity.Adapt();
        // var entityDto = entity.Adapt(dtoType);
        var dtoObject = entity.ToDtoObject(dtoType);
        Log.Logger.Information("dtoObject: {DtoObject}", dtoObject);
        foreach (var propertyInfo in dtoObject.GetType().GetProperties())
        {
            Log.Logger.Information("propertyInfo: {@PropertyInfo}", propertyInfo);
            var entityProperty = dtoObject.GetType().GetProperty(propertyInfo.Name);
            if (entityProperty != null)
            {
                var entityValue = entityProperty.GetValue(dtoObject);
                Log.Logger.Information("entityValue: {EntityValue}", entityValue);
                /*if (entityValue is Guid)
                    entityValue = entityValue.ToString();
                propertyInfo.SetValue(dtoObject, entityValue);*/
            }
            /*var entityProperty = entity.GetType().GetProperty(propertyInfo.Name);
            if (entityProperty is null)
            {
                Log.Logger.Information("entityProperty is null");
                continue;
            }*/
            // Log.Logger.Information("propertyInfo: {@PropertyInfo}", propertyInfo.GetValue());
        }

        // Log.Logger.Information("entityDto: {EntityDto}", entityDto);
        // return new dtoType { };

        /*JsonSerializer.Deserialize(
            entity.Adapt(dtoType),
            // dtoType,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        )!;*/
        // var toJson = JsonSerializer.Serialize(entityDto);
        var toJson = JsonSerializer.Serialize(entity);
        return new ProjectEventResponse
        {
            RequestId = command.RequestId,
            ProjectId = entity.ProjectId.ToString(),
            ByAppUserId = command.User.Id.ToString(),
            Action = action,
            Model = entity.GetType().Name,
            Data = toJson
        };
        /*{
            User = context.ToHubAppUser(),
            Request = fromJson,
            RequestId = projectEvent.RequestId
        };*/
    }

    public static object ToDtoObject<TEntity>(this TEntity entity, Type dtoType)
        where TEntity : IProjectItem
    {
        /*var entityDto = entity.Adapt(dtoType);
        var json = JsonSerializer.Deserialize(
            entityDto,
            dtoType,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
        )!;*/
        // var requestType = projectEvent.ToRequestType();
        /*var eventRequest = (IProjectEventRequest)
            JsonSerializer.Deserialize(
                projectEvent.Data,
                requestType,
                new JsonSerializerOptions { PropertyNameCaseInsensitive = true }
            )!;*/

        // var commandType = projectEvent.ToCommandType();
        var dtoObject = Activator.CreateInstance(dtoType)!;
        foreach (var propertyInfo in dtoType.GetProperties())
        {
            Log.Logger.Information("propertyInfo: {@PropertyInfo}", propertyInfo);
            var entityProperty = entity.GetType().GetProperty(propertyInfo.Name);
            if (entityProperty != null)
            {
                var entityValue = entityProperty.GetValue(entity);
                if (entityValue is Guid)
                    entityValue = entityValue.ToString();
                propertyInfo.SetValue(dtoObject, entityValue);
            }
        }

        /*var commandProperty = commandType.GetProperty("Request")!;
        commandProperty.SetValue(dtoObject, eventRequest);
        var userProperty = commandType.GetProperty("User")!;
        userProperty.SetValue(dtoObject, context.ToHubAppUser());
        var requestIdProperty = commandType.GetProperty("RequestId")!;
        requestIdProperty.SetValue(dtoObject, projectEvent.RequestId);*/
        return dtoObject;
    }

    public static object ToCommandObject(this ProjectEvent projectEvent, HubCallerContext context)
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

        var typeName = $"Projects.API.Handlers.{model}s.{action}{model}.{action}{model}Command";
        return Type.GetType(typeName) ?? throw new InvalidOperationException();
    }

    private static Type ToRequestType(this ProjectEvent request)
    {
        var model = request.Model.ToPascalCase();
        var action = request.Action.ToPascalCase();

        var typeName = $"Projects.API.Contracts.Requests.{model}s.{action}{model}Request";
        return Type.GetType(typeName) ?? throw new InvalidOperationException();
    }

    private static Type ToDtoType<TEntity>(this TEntity request)
        where TEntity : IProjectItem
    {
        var entityModel = request.GetType().Name.ToPascalCase();
        var typeName = $"Projects.API.Contracts.Data.{entityModel}Dto";
        return Type.GetType(typeName) ?? throw new InvalidOperationException();
    }
}