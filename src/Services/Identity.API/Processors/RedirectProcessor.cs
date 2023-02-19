using FastEndpoints;
using FluentValidation.Results;

namespace Identity.API.Processors;

public class RedirectProcessor : IGlobalPostProcessor
{
    public async Task PostProcessAsync(object req, object? res, HttpContext ctx,
        IReadOnlyCollection<ValidationFailure> failures, CancellationToken ct)
    {
        throw new NotImplementedException();
    }
}