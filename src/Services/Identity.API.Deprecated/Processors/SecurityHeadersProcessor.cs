using FastEndpoints;
using FluentValidation.Results;

namespace Identity.API.Deprecated.Processors;

public class SecurityHeadersProcessor : IGlobalPreProcessor
{
    public Task PreProcessAsync(object req, HttpContext ctx, List<ValidationFailure> failures, CancellationToken ct)
    {
        if (!ctx.Response.Headers.ContainsKey("X-Content-Type-Options"))
            ctx.Response.Headers.Add("X-Content-Type-Options", "nosniff");

        if (!ctx.Response.Headers.ContainsKey("X-Frame-Options"))
            ctx.Response.Headers.Add("X-Frame-Options", "SAMEORIGIN");

        var csp =
            "default-src 'self'; object-src 'none'; frame-ancestors 'none'; sandbox allow-forms allow-same-origin allow-scripts; base-uri 'self';";

        if (!ctx.Response.Headers.ContainsKey("Content-Security-Policy"))
            ctx.Response.Headers.Add("Content-Security-Policy", csp);
        // and once again for IE
        if (!ctx.Response.Headers.ContainsKey("X-Content-Security-Policy"))
            ctx.Response.Headers.Add("X-Content-Security-Policy", csp);

        var referrerPolicy = "no-referrer";
        if (!ctx.Response.Headers.ContainsKey("Referrer-Policy"))
            ctx.Response.Headers.Add("Referrer-Policy", referrerPolicy);

        return Task.CompletedTask;
    }
}