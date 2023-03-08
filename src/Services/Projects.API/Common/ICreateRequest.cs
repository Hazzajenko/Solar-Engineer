namespace Projects.API.Common;

public interface ICreateRequest<TModel> : IProjectSignalrRequest
    where TModel : class
{
    TModel Create { get; init; }
}