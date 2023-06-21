using System.Text.Json;
using Infrastructure.Logging;
using Microsoft.AspNetCore.SignalR;
using Projects.Contracts.Responses;
using Projects.Domain.Common;
using Projects.Domain.Entities;

namespace Projects.Application.Mapping;

public static class ProjectEventsMapper
{
    public static ProjectEventResponse ToProjectEventResponseFromEntity<TEntity, TProjectCommand>(
        this TEntity entity,
        TProjectCommand command,
        string action
    )
        where TEntity : IProjectItem
        where TProjectCommand : IProjectCommand
    {
        var dtoObject = entity.ToDtoObject();

        var toJson = JsonSerializer.Serialize(
            dtoObject,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
        );
        var projectEventResponse = new ProjectEventResponse
        {
            RequestId = command.RequestId,
            ProjectId = command.ProjectId,
            ByAppUserId = command.User.Id.ToString(),
            Action = action,
            Model = entity.GetType().Name,
            Data = toJson
        };
        projectEventResponse.DumpObjectJson();
        return projectEventResponse;
    }

    /*public static ProjectEventResponse ToOptimisedUpdateManyProjectEventResponseFromEntity<
        TEntityUpdate,
        TEntity,
        TProjectCommand
    >(this IEnumerable<TEntityUpdate> entities, TProjectCommand command, string action, string model, bool appending = false)
        where TEntity : IProjectItem
        where TEntityUpdate : IProjectItemUpdate<TEntity, IProjectItemPartial<TEntity>>
        where TProjectCommand : IProjectCommand
    {
        var dtoObject = entities.ToDtoObject();

        var toJson = JsonSerializer.Serialize(
            dtoObject,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
        );
        var projectEventResponse = new ProjectEventResponse
        {
            RequestId = command.RequestId,
            ProjectId = command.ProjectId,
            ByAppUserId = command.User.Id.ToString(),
            Action = action,
            Model = model,
            Data = toJson,
            Appending = appending
        };
        projectEventResponse.DumpObjectJson();
        return projectEventResponse;
    }*/

    public static CombinedProjectEventResponse ToCombinedProjectEventResponse(
        this ProjectEventResponse response1,
        ProjectEventResponse response2,
        Guid appUserId
    )
    {
        if (response1.ProjectId != response2.ProjectId)
        {
            throw new HubException("ProjectIds do not match");
        }

        if (response1.RequestId != response2.RequestId)
        {
            throw new HubException("RequestIds do not match");
        }

        if (response1.ByAppUserId != response2.ByAppUserId)
        {
            throw new HubException("ByAppUserIds do not match");
        }

        var projectEventResponse = new CombinedProjectEventResponse()
        {
            RequestId = response1.RequestId,
            ProjectId = response1.ProjectId,
            ByAppUserId = appUserId.ToString(),
            ActionOne = response1.Action,
            ModelOne = response1.Model,
            DataOne = response1.Data,
            ActionTwo = response2.Action,
            ModelTwo = response2.Model,
            DataTwo = response2.Data
        };
        projectEventResponse.DumpObjectJson();
        return projectEventResponse;
    }

    public static ProjectEventResponse ToProjectEventResponseFromEntityList<
        TEntity,
        TProjectCommand
    >(
        this IEnumerable<TEntity> entities,
        TProjectCommand command,
        string action,
        bool appending = false
    )
        where TEntity : IProjectItem
        where TProjectCommand : IProjectCommand
    {
        var dtoObject = entities.ToDtoObject();

        var toJson = JsonSerializer.Serialize(
            dtoObject,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
        );
        var projectEventResponse = new ProjectEventResponse
        {
            RequestId = command.RequestId,
            ProjectId = command.ProjectId,
            ByAppUserId = command.User.Id.ToString(),
            Action = action,
            Model = typeof(TEntity).Name,
            Data = toJson,
            Appending = appending
        };
        projectEventResponse.DumpObjectJson();
        return projectEventResponse;
    }

    public static ProjectEventResponse ToProjectEventResponseFromId<TEntity>(
        this string entityId,
        IProjectCommand command,
        string action
    )
        where TEntity : IProjectItem
    {
        // var response = new { Id = entityId };

        var toJson = JsonSerializer.Serialize(
            entityId,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
        );
        // var toJson = JsonSerializer.Serialize(response);
        var projectEventResponse = new ProjectEventResponse
        {
            RequestId = command.RequestId,
            ProjectId = command.ProjectId,
            ByAppUserId = command.User.Id.ToString(),
            Action = action,
            Model = typeof(TEntity).Name,
            Data = toJson
        };
        projectEventResponse.DumpObjectJson();
        return projectEventResponse;
    }

    public static ProjectEventResponse ToProjectEventResponseFromIdList<TEntity>(
        this IEnumerable<string> entityIds,
        IProjectCommand command,
        string action
    )
        where TEntity : IProjectItem
    {
        // var response = entityIds.Select(id => new { Id = id });

        var toJson = JsonSerializer.Serialize(
            entityIds,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
        );
        var projectEventResponse = new ProjectEventResponse
        {
            RequestId = command.RequestId,
            ProjectId = command.ProjectId,
            ByAppUserId = command.User.Id.ToString(),
            Action = action,
            Model = typeof(TEntity).Name,
            Data = toJson
        };
        projectEventResponse.DumpObjectJson();
        return projectEventResponse;
    }
}
