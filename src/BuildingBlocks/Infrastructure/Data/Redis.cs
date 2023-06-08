using StackExchange.Redis;

namespace Infrastructure.Data;

public static class RedisExtensions
{
    private const string RedisConnectionString = "REDIS_CONNECTION_STRING";

    public static async Task<ConnectionMultiplexer> GetConnectionMultiplexerAsync(TextWriter? log = null)
    {
        return await ConnectionMultiplexer.ConnectAsync(
            GetRedisConnectionString(), log);
    }

    public static string GetRedisConnectionString()
    {
        return GetEnvironmentVariable(RedisConnectionString);
    }

    public static IDatabase GetDatabase()
    {
        var connectionMultiplexer = ConnectionMultiplexer.Connect(GetRedisConnectionString());
        return connectionMultiplexer.GetDatabase();
    }
}