namespace Identity.API.Data;

public static class Constants
{
    public static class Role
    {
        public const string Admin = "admin";
        public const string User = "user";
    }

    public static class StandardScopes
    {
        public const string Roles = "roles";
        public const string UsersApi = "users-api";
        public const string MessagesApi = "messages-api";
    }
}