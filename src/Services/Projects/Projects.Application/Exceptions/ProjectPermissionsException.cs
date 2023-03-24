using System.Runtime.Serialization;
using FluentValidation;
using FluentValidation.Results;

namespace Projects.Application.Exceptions;

public class ProjectPermissionsException : ValidationException
{
    public ProjectPermissionsException(string message) : base(message)
    {
    }

    public ProjectPermissionsException(string message, IEnumerable<ValidationFailure> errors) : base(message, errors)
    {
    }

    public ProjectPermissionsException(string message, IEnumerable<ValidationFailure> errors, bool appendDefaultMessage)
        : base(message, errors, appendDefaultMessage)
    {
    }

    public ProjectPermissionsException(IEnumerable<ValidationFailure> errors) : base(errors)
    {
    }

    public ProjectPermissionsException(SerializationInfo info, StreamingContext context) : base(info, context)
    {
    }
}