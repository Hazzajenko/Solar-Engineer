using System.Net;

namespace Identity.API.Exceptions;

public class NotAuthenticatedException : ApiException
{
    public NotAuthenticatedException()
        : base(HttpStatusCode.Forbidden)
    {
    }
}