using System.Net;

namespace ApplicationCore.Exceptions;

public class NotFoundException : CustomException
{
    public NotFoundException(string message)
        : base(message, HttpStatusCode.NotFound)
    {
    }
}