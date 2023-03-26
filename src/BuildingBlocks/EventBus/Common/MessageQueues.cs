namespace EventBus.Common;

public static class MessageQueues
{
    public const string LocalHost = "localhost";

    public static class Projects
    {
        public const string EventsQueue = "projects-events";
        public const string EventsExchange = "projects-events-exchange";

        public const string EventResponsesQueue = "projects-event-responses";
        public const string EventResponsesExchange = "projects-event-responses-exchange";
    }

    public static class Messages
    {
        public const string EventsQueue = "messages-events";
        public const string EventsExchange = "messages-events-exchange";

        public const string EventResponsesQueue = "messages-event-responses";
        public const string EventResponsesExchange = "messages-event-responses-exchange";
    }

    public static class Notifications
    {
        public const string EventsQueue = "notifications-events";
        public const string EventsExchange = "notifications-events-exchange";

        public const string EventResponsesQueue = "notifications-event-responses";
        public const string EventResponsesExchange = "notifications-event-responses-exchange";
    }

    public static class Users
    {
        public const string EventsQueue = "users-events";
        public const string EventsExchange = "users-events-exchange";

        public const string EventResponsesQueue = "users-event-responses";
        public const string EventResponsesExchange = "users-event-responses-exchange";
    }

    public static class AppUsers
    {
        public const string Events = "appusers-events";
        public const string EventsQueue = "appuser-events";
        public const string EventsExchange = "appuser-events-exchange";

        public const string EventResponses = "appusers-event-responses";
        public const string EventResponsesQueue = "appuser-event-responses";
        public const string EventResponsesExchange = "appuser-event-responses-exchange";
    }

    /*
    public const string AppUserEventsQueue = "appuser-events";
    public const string AppUserEventsExchange = "appuser-events-exchange";

    public const string AppUserEventResponsesQueue = "appuser-event-responses";
    public const string AppUserEventResponsesExchange = "appuser-event-responses-exchange";*/
}