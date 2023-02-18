using System.Text;

namespace Infrastructure.Extensions;

public static class LinqExtensions
{
    public static async Task<IEnumerable<TResult>> SelectAsync<TSource,TResult>(
        this IEnumerable<TSource> source, Func<TSource, Task<TResult>> method)
    {
        return await Task.WhenAll(source.Select(async s => await method(s)));
    }
    
    public static async Task<IEnumerable<TResult>> SelectAsync<TSource, TResult>(
        this IEnumerable<TSource> source, Func<TSource, Task<TResult>> method,
        int concurrency = int.MaxValue)
    {
        if (concurrency <= 0) throw new ArgumentOutOfRangeException(nameof(concurrency));
        var semaphore = new SemaphoreSlim(concurrency);
        try
        {
            return await Task.WhenAll(source.Select(async s =>
            {
                try
                {
                    await semaphore.WaitAsync();
                    return await method(s);
                }
                finally
                {
                    semaphore.Release();
                }
            }));
        } finally
        {
            semaphore.Dispose();
        }
    }
}