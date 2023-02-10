using System.Net;

namespace Auth.API.Exceptions;

public class NotFoundException : ApiException
{
    public NotFoundException(string message)
        : base(HttpStatusCode.NotFound, message)
    {
    }
}