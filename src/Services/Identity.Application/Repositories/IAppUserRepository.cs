using Identity.Application.Entities;
using Infrastructure.Repositories;

namespace Identity.Application.Repositories;

public interface IAppUserRepository : IGenericRepository<AppUser>
{
}