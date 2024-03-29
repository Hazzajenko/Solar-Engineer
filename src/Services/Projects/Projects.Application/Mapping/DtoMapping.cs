﻿using Projects.Domain.Common;
using Serilog;

namespace Projects.Application.Mapping;

public static class DtoMapping
{
    public static object ToDtoObject<TEntity>(this TEntity entity)
        where TEntity : IProjectItem
    {
        var dtoType = entity.ToDtoType();
        var dtoObject = Activator.CreateInstance(dtoType)!;
        foreach (var propertyInfo in dtoType.GetProperties())
        {
            var entityProperty = entity.GetType().GetProperty(propertyInfo.Name);
            if (entityProperty != null)
            {
                var entityValue = entityProperty.GetValue(entity);
                if (entityValue is Guid)
                    entityValue = entityValue.ToString();
                propertyInfo.SetValue(dtoObject, entityValue);
            }
        }

        return dtoObject;
    }

    public static object ToDtoObject<TEntity>(this IEnumerable<TEntity> entities)
        where TEntity : IProjectItem
    {
        return InvokeStaticGenericMethod(
            typeof(DtoMapping),
            nameof(ToDtoIEnumerable),
            new[] { typeof(TEntity), entities.ToDtoType() },
            entities
        );
    }

    public static TDto ToDtoObjectWithGenerics<TEntity, TDto>(this TEntity entity)
        where TEntity : IProjectItem
        where TDto : IProjectItemDto
    {
        var dtoType = entity.ToDtoType();
        var dtoObject = Activator.CreateInstance(dtoType)!;
        foreach (var propertyInfo in dtoType.GetProperties())
        {
            var entityProperty = entity.GetType().GetProperty(propertyInfo.Name);
            if (entityProperty != null)
            {
                var entityValue = entityProperty.GetValue(entity);
                if (entityValue is Guid)
                    entityValue = entityValue.ToString();
                propertyInfo.SetValue(dtoObject, entityValue);
            }
        }

        return (TDto)dtoObject;
    }

    public static IEnumerable<TDto> ToDtoIEnumerable<TEntity, TDto>(
        this IEnumerable<TEntity> entities
    )
        where TEntity : IProjectItem
        where TDto : IProjectItemDto
    {
        return entities.Select(x => x.ToDtoObjectWithGenerics<TEntity, TDto>());
    }

    private static Type ToDtoType<TEntity>(this TEntity request)
        where TEntity : IProjectItem
    {
        var typeName = request.GetType().Name ?? throw new ArgumentNullException(nameof(request));
        return ScanForContracts(typeof(IProjectItemDto), $"{typeName}Dto");
    }

    private static Type ToDtoType<TEntity>(this IEnumerable<TEntity> request)
        where TEntity : IProjectItem
    {
        var typeName =
            request.FirstOrDefault()?.GetType().Name
            ?? throw new ArgumentNullException(nameof(request));
        ;
        return ScanForContracts(typeof(IProjectItemDto), $"{typeName}Dto");
    }
}
