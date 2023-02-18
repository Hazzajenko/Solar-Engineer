using Infrastructure.Data;

namespace Auth.API.Data;

public class AuthUnitOfWork : UnitOfWorkFactory<AuthContext>, IAuthUnitOfWork
{
    public AuthUnitOfWork(AuthContext context) : base(context)
    {
    }
}