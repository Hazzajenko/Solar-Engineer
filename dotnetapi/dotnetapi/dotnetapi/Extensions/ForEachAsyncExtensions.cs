namespace dotnetapi.Extensions;

public static class ForEachAsyncExtensions
{
    public static async Task ForEachAsync<T>(this List<T> list, Func<T, Task> func)
    {
        foreach (var value in list) await func(value);
    }
}