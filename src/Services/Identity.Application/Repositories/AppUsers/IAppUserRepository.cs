using Identity.Application.Entities;
using Identity.Contracts.Data;
using Infrastructure.Repositories;

namespace Identity.Application.Repositories.AppUsers;

public interface IAppUserRepository : IGenericRepository<AppUser>
{
    Task<CurrentUserDto?> GetAppUserDtoByIdAsync(Guid id);
}