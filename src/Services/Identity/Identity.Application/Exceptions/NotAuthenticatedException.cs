using System.Net;

namespace Identity.Application.Exceptions;

public class NotAuthenticatedException : ApiException
{
    public NotAuthenticatedException()
        : base(HttpStatusCode.Forbidden)
    {
    }
}