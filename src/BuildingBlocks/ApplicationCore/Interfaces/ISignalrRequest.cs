using ApplicationCore.Entities;

namespace ApplicationCore.Interfaces;

public interface ISignalrRequest
{
    AuthUser AuthUser { get; init; }
}
