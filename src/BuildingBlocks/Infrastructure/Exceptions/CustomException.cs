using System.Net;

namespace Infrastructure.Exceptions;

public class CustomException : Exception
{
    public CustomException(string message, HttpStatusCode statusCode = HttpStatusCode.InternalServerError)
        : base(message)
    {
        StatusCode = statusCode;
    }

    public HttpStatusCode StatusCode { get; }
}