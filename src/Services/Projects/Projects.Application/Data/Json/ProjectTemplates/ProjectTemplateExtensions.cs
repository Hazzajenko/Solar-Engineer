using System.Reflection;
using System.Text.Json;
using Projects.Contracts.Data;
using Projects.Domain.Common;
using Serilog;

namespace Projects.Application.Data.Json.ProjectTemplates;

public static class ProjectTemplateExtensions
{
    public static async Task<ProjectTemplate> GetProjectTemplateByKey(
        this ProjectTemplateKey templateKey
    )
    {
        var jsonFileName = templateKey.JsonFileName;
        var templateJson = await jsonFileName.GetJsonString();
        Log.Logger.Information("templateJson: {TemplateJson}", templateJson);

        var template = templateJson.Deserialize<ProjectTemplate>();

        return template;
    }

    public static async Task<string> GetJsonString()
    {
        var resourceName =
            $"Projects.Application.Data.Json.ProjectTemplates.12-rows-no-strings.template.json";
        var assembly = Assembly.GetExecutingAssembly();

        await using Stream stream = assembly.GetManifestResourceStream(resourceName)!;
        using var reader = new StreamReader(stream);
        return await reader.ReadToEndAsync();
    }

    private static async Task<string> GetJsonString(this string jsonFileName)
    {
        var resourceName = $"Projects.Application.Data.Json.ProjectTemplates.{jsonFileName}";
        var assembly = Assembly.GetExecutingAssembly();

        await using Stream stream = assembly.GetManifestResourceStream(resourceName)!;
        using var reader = new StreamReader(stream);
        return await reader.ReadToEndAsync();
    }

    private static T Deserialize<T>(this string json)
    {
        var result = JsonSerializer.Deserialize<T>(
            json,
            new JsonSerializerOptions { PropertyNameCaseInsensitive = true, }
        );
        if (result is null)
        {
            throw new JsonException($"Failed to deserialize JSON: {json}");
        }

        return result;
    }
}
