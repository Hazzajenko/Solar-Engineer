using System.Net;
using Microsoft.AspNetCore.SignalR;

namespace ApplicationCore.Exceptions;

public class NotAuthenticatedHubException : HubException
{
    public NotAuthenticatedHubException()
        : base("Not Authenticated") { }

    public NotAuthenticatedHubException(string message)
        : base($"Not Authenticated: {message}") { }
}
