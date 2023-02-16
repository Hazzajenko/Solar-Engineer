using System.Text.Json;

namespace Infrastructure.Helpers;

public static class Helpers
{
    public static bool CompareObjects(object obj1, object obj2)
    {
        return JsonSerializer.Serialize(obj1) == JsonSerializer.Serialize(obj2);
    }
}