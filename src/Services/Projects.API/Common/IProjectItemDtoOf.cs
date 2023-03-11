using Projects.API.Data;

namespace Projects.API.Common;

public interface IProjectItemDtoOf
{
}

public interface IProjectItemDtoOf<TProjectItem> : IProjectItemDtoOf
    where TProjectItem : IProjectItem
{
}