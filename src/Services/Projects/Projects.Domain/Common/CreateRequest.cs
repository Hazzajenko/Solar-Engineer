namespace Projects.Domain.Common;

public abstract class CreateRequest<TModel> : ICreateRequest<TModel>
    where TModel : class
{
    public required string RequestId { get; init; }
    public required string ProjectId { get; init; }
    public required TModel Create { get; init; }
}