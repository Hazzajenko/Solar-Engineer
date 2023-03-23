using System.Net;

namespace Identity.API.Deprecated.Exceptions;

public class NotAuthenticatedException : ApiException
{
    public NotAuthenticatedException()
        : base(HttpStatusCode.Forbidden)
    {
    }
}