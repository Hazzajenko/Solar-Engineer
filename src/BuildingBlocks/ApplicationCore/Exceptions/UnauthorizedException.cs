using System.Net;

namespace ApplicationCore.Exceptions;

public class UnauthorizedException : ApiException
{
    public UnauthorizedException()
        : base(HttpStatusCode.Unauthorized)
    {
    }
}