using System.ComponentModel.DataAnnotations;
using System.Net;
using backend.Dto.Error;
using backend.Exceptions;

namespace backend.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        this.next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context); 
        }
        catch (BaseException ex)
        {
            await HandleExceptionAsync(context, ex.StatusCode, ex.Message);
        }
        catch (FluentValidation.ValidationException ex)
        {
            var errors = ex.Errors
                .GroupBy(e => e.PropertyName)
                .ToDictionary(
                    g => g.Key,
                    g => g.Select(e => e.ErrorMessage).ToArray()
                );

            await HandleExceptionAsync(context, 400, "Validation failed", errors);
        }

        catch (Exception)
        {
            await HandleExceptionAsync(context, (int)HttpStatusCode.InternalServerError, "Internal server error");
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, int statusCode, string message, Dictionary<string, string[]>? errors = null)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = statusCode;

        var response = new ErrorResponseDto
        {
            Message = message,
            StatusCode = statusCode,
            TraceId = context.TraceIdentifier,
            Errors = errors
        };

        return context.Response.WriteAsJsonAsync(response);
    }

}
