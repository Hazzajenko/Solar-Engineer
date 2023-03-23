using System.Net;

namespace Identity.Application.Exceptions;

public class UnauthorizedException : ApiException
{
    public UnauthorizedException()
        : base(HttpStatusCode.Unauthorized)
    {
    }
}