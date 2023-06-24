namespace ApplicationCore.Contracts.Responses;

public class ValidationFailureResponse
{
    // public required IEnumerable<string> Errors { get; init; }
    public required IEnumerable<ValidationResponse> Errors { get; init; }
}

public class ValidationResponse
{
    public required string PropertyName { get; init; }

    public required string Message { get; init; }
}