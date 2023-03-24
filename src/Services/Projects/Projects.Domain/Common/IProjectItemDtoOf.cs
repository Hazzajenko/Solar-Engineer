namespace Projects.Domain.Common;

public interface IProjectItemDtoOf
{
}

public interface IProjectItemDtoOf<TProjectItem> : IProjectItemDtoOf
    where TProjectItem : IProjectItem
{
}