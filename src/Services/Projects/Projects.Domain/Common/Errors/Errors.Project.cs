using ErrorOr;

namespace Projects.Domain.Common.Errors;

public static class Errors
{
    public static class Project
    {
        public static Error ProjectNotFound =>
            Error.NotFound("Project.NotFound", "Project not found.");

        public static Error ProjectAlreadyExists =>
            Error.Conflict("Project.AlreadyExists", "Project already exists.");

        public static Error ProjectAlreadyJoined =>
            Error.Conflict("Project.AlreadyJoined", "Project already joined.");

        public static Error ProjectNotJoined =>
            Error.Conflict("Project.NotJoined", "Project not joined.");

        public static Error NoInvitePermissions =>
            Error.Conflict("Project.NoInvitePermissions", "No invite permissions.");

        public static Error NoKickPermissions =>
            Error.Conflict("Project.NoKickPermissions", "No kick permissions.");
    }
}