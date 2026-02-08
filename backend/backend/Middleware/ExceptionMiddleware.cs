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
            Errors = errors
        };

        return context.Response.WriteAsJsonAsync(response);
    }

}
