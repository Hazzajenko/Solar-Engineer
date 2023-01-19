namespace dotnetapi.Features.Messages.Contracts.Requests;

public static class MessagesFilter
{
    public static string Received => "received";
    public static string Sent => "sent";
}

public enum MessageFilter
{
    None,
    Received,
    Sent
}