using System.Text.Json;
using Infrastructure.Logging;
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
        where TProjectCommand : IProjectCommand
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
        where TProjectCommand : IProjectCommand
    {
        // var dtoType = entity.ToDtoType();
        // Log.Logger.Information("dtoType: {DtoType}", dtoType);

        var dtoObject = entity.ToDtoObject();
        Log.Logger.Information("dtoObject: {DtoObject}", dtoObject);

        // dtoObject.DumpObjectProperties();
        dtoObject.DumpObjectJson();

        var toJson = JsonSerializer.Serialize(dtoObject);
        return new ProjectEventResponse
        {
            RequestId = command.RequestId,
            ProjectId = entity.ProjectId.ToString(),
            ByAppUserId = command.User.Id.ToString(),
            Action = action,
            Model = entity.GetType().Name,
            Data = toJson
        };
    }

    public static ProjectEventResponse ToProjectEventResponseV3<TEntity, TProjectCommand>(
        this IEnumerable<TEntity> entity,
        TProjectCommand command,
        string action,
        string projectId
    )
        where TEntity : IProjectItem
        where TProjectCommand : IProjectCommand
    {
        var dtoObject = entity.ToDtoObject();
        Log.Logger.Information("dtoObject: {DtoObject}", dtoObject);

        dtoObject.DumpObjectJson();

        var toJson = JsonSerializer.Serialize(dtoObject);
        return new ProjectEventResponse
        {
            RequestId = command.RequestId,
            ProjectId = projectId,
            ByAppUserId = command.User.Id.ToString(),
            Action = action,
            Model = typeof(TEntity).Name,
            Data = toJson
        };
    }

    public static ProjectEventResponse ToProjectEventResponseWithStringV3<TProjectCommand>(
        this string entityId,
        TProjectCommand command,
        string action,
        string projectId,
        Type modelType
    )
        where TProjectCommand : IProjectCommand
    {
        var response = new { Id = entityId };

        var toJson = JsonSerializer.Serialize(response);
        return new ProjectEventResponse
        {
            RequestId = command.RequestId,
            ProjectId = projectId,
            ByAppUserId = command.User.Id.ToString(),
            Action = action,
            Model = modelType.Name,
            Data = toJson
        };
    }
    
    public static ProjectEventResponse ToProjectEventResponseWithStringListV3<TProjectCommand>(
        this IEnumerable<string> entityIds,
        TProjectCommand command,
        string action,
        string projectId,
        Type modelType
    )
        where TProjectCommand : IProjectCommand
    {
        var response = entityIds.Select(id => new { Id = id });
        // var response = new { Id = entityId };

        var toJson = JsonSerializer.Serialize(response);
        return new ProjectEventResponse
        {
            RequestId = command.RequestId,
            ProjectId = projectId,
            ByAppUserId = command.User.Id.ToString(),
            Action = action,
            Model = modelType.Name,
            Data = toJson
        };
    }
}