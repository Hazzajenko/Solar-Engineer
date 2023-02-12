using System.Net;

namespace Auth.API.Exceptions;

public class UnauthorizedException : ApiException
{
    public UnauthorizedException()
        : base(HttpStatusCode.Unauthorized)
    {
    }
}