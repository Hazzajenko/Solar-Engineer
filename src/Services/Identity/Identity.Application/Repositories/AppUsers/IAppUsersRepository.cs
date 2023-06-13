using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Repositories;

namespace Identity.Application.Repositories.AppUsers;

public interface IAppUsersRepository : IGenericRepository<AppUser>
{
    Task<CurrentUserDto?> GetAppUserDtoByIdAsync(Guid id);
    Task<IEnumerable<AppUser>> GetAppUsersByIdsAsync(IEnumerable<Guid> ids);
    Task<IEnumerable<MinimalAppUserDto>> SearchForAppUserByUserNameAsync(string userName);
}
