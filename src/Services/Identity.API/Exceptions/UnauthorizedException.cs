using System.Net;

namespace Identity.API.Exceptions;

public class UnauthorizedException : ApiException
{
    public UnauthorizedException()
        : base(HttpStatusCode.Unauthorized)
    {
    }
}