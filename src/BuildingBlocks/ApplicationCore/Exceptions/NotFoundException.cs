using System.Net;

namespace ApplicationCore.Exceptions;

public class NotFoundException : ApiException
{
    public NotFoundException(string message)
        : base(HttpStatusCode.NotFound, message)
    {
    }
}