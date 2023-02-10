using System.Net;

namespace Auth.API.Exceptions;

public class NotAuthenticatedException : ApiException
{
    public NotAuthenticatedException()
        : base(HttpStatusCode.Forbidden)
    {
    }
}