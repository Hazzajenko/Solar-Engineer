using Auth.API.Data;
using Auth.API.Entities;
using DotNetCore.EntityFrameworkCore;
using Infrastructure.Repositories;
using Microsoft.EntityFrameworkCore;

namespace Auth.API.Repositories;

public sealed class AppUserRepository : GenericRepository<AuthContext, AuthUser>, IAppUserRepository
{
    public AppUserRepository(AuthContext context) : base(context)
    {
    }
}