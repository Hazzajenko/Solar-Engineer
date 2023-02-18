using Auth.API.Entities;
using DotNetCore.Repositories;
using Infrastructure.Repositories;

namespace Auth.API.Repositories;

public interface IAppUserRepository : IGenericRepository<AuthUser>
{

}