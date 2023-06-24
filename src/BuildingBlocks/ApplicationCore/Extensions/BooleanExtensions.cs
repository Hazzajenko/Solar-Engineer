namespace ApplicationCore.Extensions;

public static class BooleanExtensions
{
    public static bool IfFalse(this bool value, Action<bool> func)
    {
        func(value);
        return value;
    }
}
