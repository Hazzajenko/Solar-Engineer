using Identity.Contracts.Data;
using Identity.Domain.Auth;
using Infrastructure.Repositories;

namespace Identity.Application.Repositories.AppUsers;

public interface IAppUserRepository : IGenericRepository<AppUser>
{
    Task<CurrentUserDto?> GetAppUserDtoByIdAsync(Guid id);
}