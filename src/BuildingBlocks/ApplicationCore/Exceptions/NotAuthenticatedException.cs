using System.Net;

namespace ApplicationCore.Exceptions;

public class NotAuthenticatedException : ApiException
{
    public NotAuthenticatedException()
        : base(HttpStatusCode.Forbidden)
    {
    }
}