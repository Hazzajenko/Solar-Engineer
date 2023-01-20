using System.Text.Json;

namespace dotnetapi.Extensions;

public static class JsonExtensions
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    public static T FromJson<T>(this string json)
    {
        return JsonSerializer.Deserialize<T>(json, JsonOptions)!;
    }

    public static string ToJson<T>(this T obj)
    {
        return JsonSerializer.Serialize(obj, JsonOptions);
    }
}