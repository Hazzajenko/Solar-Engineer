using System.Net;

namespace Identity.API.Deprecated.Exceptions;

public class UnauthorizedException : ApiException
{
    public UnauthorizedException()
        : base(HttpStatusCode.Unauthorized)
    {
    }
}