using System.Text;
using System.Text.Json;
using Serilog;

namespace Infrastructure.Logging;

public static partial class LoggingExtensions
{
    public static void DumpObjectProperties(this object obj)
    {
        var sb = new StringBuilder();
        var type = obj.GetType();
        var typeName = type.Name;
        var properties = type.GetProperties();
        foreach (var property in properties)
        {
            var value = property.GetValue(obj);
            sb.AppendLine($"{property.Name}: {value}");
        }

        Log.Logger.Information("{Type} properties: {Sb}", typeName, sb.ToString());
    }

    public static void DumpObjectJson(this object obj)
    {
        var type = obj.GetType();
        var typeName = type.Name;
        var json = JsonSerializer.Serialize(
            obj,
            new JsonSerializerOptions
            {
                WriteIndented = true,
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            }
        );
        Log.Logger.Information("{Type} json: {Json}", typeName, json);
    }
}