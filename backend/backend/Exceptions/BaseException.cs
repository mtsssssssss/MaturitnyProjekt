namespace backend.Exceptions;

public class BaseException : Exception
{
    public int StatusCode { get; }

    public BaseException(string message, int statusCode = 400)
        : base(message)
    {
        StatusCode = statusCode;
    }
}
