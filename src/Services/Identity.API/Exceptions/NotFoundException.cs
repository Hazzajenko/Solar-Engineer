using System.Net;

namespace Identity.API.Exceptions;

public class NotFoundException : ApiException
{
    public NotFoundException(string message)
        : base(HttpStatusCode.NotFound, message)
    {
    }
}