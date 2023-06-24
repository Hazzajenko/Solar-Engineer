using Ardalis.Specification;

namespace ApplicationCore.Interfaces;

public interface IRepository<T> : IRepositoryBase<T> where T : class, IAggregateRoot
{
}
