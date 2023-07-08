namespace ApplicationCore.Extensions;

public static class DictionaryExtensions
{
    public static Dictionary<string, string> ToStringDictionary(
        this Dictionary<string, object> originalDict
    )
    {
        return originalDict.ToDictionary(kvp => kvp.Key, kvp => kvp.Value?.ToString() ?? "null");
    }
}
