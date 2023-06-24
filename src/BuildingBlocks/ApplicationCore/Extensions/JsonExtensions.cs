using System.Text.Json;

namespace ApplicationCore.Extensions;

public static class JsonExtensions
{
    public static string ToJson<T>(this T obj)
    {
        return JsonSerializer.Serialize(
            obj,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
        );
    }

    public static T? FromJson<T>(this string json)
    {
        return JsonSerializer.Deserialize<T>(
            json,
            new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase }
        );
    }

    public static string ToPrettyJson<T>(this T obj)
    {
        return JsonSerializer.Serialize(
            obj,
            new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            }
        );
    }
}
