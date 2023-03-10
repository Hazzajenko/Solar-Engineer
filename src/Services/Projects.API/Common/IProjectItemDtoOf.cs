using Projects.API.Data;

namespace Projects.API.Common;

public interface IProjectItemDtoOf<TProjectItem>
    where TProjectItem : IProjectItem
{
}