using ErrorOr;

namespace Projects.Domain.Common.Errors;

public static partial class Errors
{
    public static class Guid
    {
        public static Error InvalidGuid => Error.Validation(
            code: "InvalidGuid",
            description: "Invalid Guid.");
    }
}