using FluentValidation;
using Infrastructure.Contracts.Responses;
using Microsoft.AspNetCore.Http;

namespace Infrastructure.Validation;

public class ValidationMappingMiddleware
{
    private readonly RequestDelegate _request;

    public ValidationMappingMiddleware(RequestDelegate request)
    {
        _request = request;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _request(context);
        }
        catch (ValidationException ex)
        {
            context.Response.StatusCode = 400;
            var messages = ex.Errors.Select(x => x.ErrorMessage).ToList();
            var validationFailureResponse = new ValidationFailureResponse
            {
                // Errors = messages
                Errors = ex.Errors.Select(
                    x =>
                        new ValidationResponse
                        {
                            PropertyName = x.PropertyName,
                            Message = x.ErrorMessage
                        }
                )
            };
            await context.Response.WriteAsJsonAsync(validationFailureResponse);
        }
    }
}