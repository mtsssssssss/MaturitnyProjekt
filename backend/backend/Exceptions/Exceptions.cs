namespace backend.Exceptions;

public sealed class NotFoundException : BaseException
{
    public NotFoundException(string message)
        : base(message, StatusCodes.Status404NotFound) { }
}

public sealed class ConflictException : BaseException
{
    public ConflictException(string message)
        : base(message, StatusCodes.Status409Conflict) { }
}

public sealed class UnauthorizedException : BaseException
{
    public UnauthorizedException(string message)
        : base(message, StatusCodes.Status401Unauthorized) { }
}
