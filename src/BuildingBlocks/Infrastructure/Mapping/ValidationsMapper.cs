using FluentValidation.Results;

namespace Infrastructure.Mapping;

public static class ValidationsMapper
{
    public static ValidationFailure[] ToValidationFailure<T>(this string message)
    {
        return new[] { new ValidationFailure(nameof(T), message) };
    }

    public static ValidationFailure[] ToArray(this ValidationFailure failure)
    {
        return new[] { failure };
    }
}