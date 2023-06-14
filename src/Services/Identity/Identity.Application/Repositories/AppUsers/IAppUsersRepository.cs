using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Repositories;

namespace Identity.Application.Repositories.AppUsers;

public interface IAppUsersRepository : IGenericRepository<AppUser>
{
    Task<AppUserDto?> GetAppUserDtoByIdAsync(Guid id);
    Task<IEnumerable<AppUser>> GetManyAppUsersByIdsAsync(IEnumerable<Guid> ids);
    Task<IEnumerable<AppUserDto>> GetManyAppUserDtosByIdsAsync(IEnumerable<Guid> ids);
    Task<IEnumerable<MinimalAppUserDto>> SearchForAppUserByUserNameAsync(string userName);
}
