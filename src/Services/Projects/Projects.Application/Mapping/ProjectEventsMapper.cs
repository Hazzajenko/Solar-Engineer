using System.Text.Json;
using Infrastructure.Logging;
using Projects.Domain.Common;
using Projects.Domain.Contracts.Responses;

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

    public static ProjectEventResponse ToProjectEventResponseFromEntityList<
        TEntity,
        TProjectCommand
    >(this IEnumerable<TEntity> entities, TProjectCommand command, string action)
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
            Data = toJson
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
        var response = new { Id = entityId };

        var toJson = JsonSerializer.Serialize(
            response,
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
        var response = entityIds.Select(id => new { Id = id });

        var toJson = JsonSerializer.Serialize(
            response,
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