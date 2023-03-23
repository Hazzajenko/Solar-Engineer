using System.Net;

namespace Identity.API.Deprecated.Exceptions;

public class NotFoundException : ApiException
{
    public NotFoundException(string message)
        : base(HttpStatusCode.NotFound, message)
    {
    }
}