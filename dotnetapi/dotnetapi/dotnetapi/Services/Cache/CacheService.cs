using System.Text.Json;
using System.Text.Json.Serialization;
using StackExchange.Redis;

namespace dotnetapi.Services.Cache;

public class CacheService : ICacheService
{
    private readonly IDatabase _cacheDb;

    public CacheService()
    {
        var redis = ConnectionMultiplexer.Connect("localhost:6379");
        _cacheDb = redis.GetDatabase();
    }

    public T? GetData<T>(string key)
    {
        var value = _cacheDb.StringGet(key);
        if (!string.IsNullOrEmpty(value)) return JsonSerializer.Deserialize<T>(value!);

        return default;
    }

    public bool SetData<T>(string key, T value, DateTimeOffset expirationTime)
    {
        var expiryTime = expirationTime.DateTime.Subtract(DateTime.Now);
        JsonSerializerOptions options = new()
        {
            ReferenceHandler = ReferenceHandler.Preserve,
            WriteIndented = true
        };
        return _cacheDb.StringSet(key, JsonSerializer.Serialize(value, options), expiryTime);
    }

    public object RemoveData(string key)
    {
        var exist = _cacheDb.KeyExists(key);

        if (exist) return _cacheDb.KeyDelete(key);

        return false;
    }
}