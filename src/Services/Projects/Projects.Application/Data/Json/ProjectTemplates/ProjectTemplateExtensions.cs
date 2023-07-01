using System.Reflection;
using Ardalis.SmartEnum;
using Newtonsoft.Json;
using Projects.Domain.Entities;
using Serilog;
using JsonException = System.Text.Json.JsonException;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace Projects.Application.Data.Json.ProjectTemplates;

public static class ProjectTemplateExtensions
{
    private const string PanelsJsonFileName = "panels.json";
    private const string StringsJsonFileName = "strings.json";
    private const string PanelLinksJsonFileName = "panel-links.json";
    private const string PanelConfigsJsonFileName = "panel-configs.json";

    public static async Task<ProjectTemplate> GetProjectTemplateByKey(
        this ProjectTemplateKey templateKey
    )
    {
        var key = templateKey.Name;
        var panelsJson = await PanelsJsonFileName.GetJsonString(key);
        var stringsJson = await StringsJsonFileName.GetJsonString(key);
        var panelLinksJson = await PanelLinksJsonFileName.GetJsonString(key);
        var panelConfigsJson = await PanelConfigsJsonFileName.GetJsonString(key);

        var panels = panelsJson.Deserialize<IEnumerable<Panel>>();
        var strings = stringsJson.Deserialize<IEnumerable<String>>();
        var panelLinks = panelLinksJson.Deserialize<IEnumerable<PanelLink>>();
        var panelConfigs = panelConfigsJson.Deserialize<IEnumerable<PanelConfig>>();

        return new ProjectTemplate
        {
            Panels = panels,
            Strings = strings,
            PanelLinks = panelLinks,
            PanelConfigs = panelConfigs
        };
    }

    private static async Task<string> GetJsonString(this string jsonFileName, string templateKey)
    {
        string jsonFilePath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "Data",
            "Json",
            "ProjectTemplates",
            // AppContext.BaseDirectory,
            $"Template{templateKey}",
            jsonFileName
        );

        // var resourceName =
        //     "Projects.Application.Data.Json.ProjectTemplates.TemplateTwelveRowsNoStrings.panels.json";
        var resourceName =
            $"Projects.Application.Data.Json.ProjectTemplates.Template{templateKey}.{jsonFileName}";
        var assembly = Assembly.GetExecutingAssembly();

        await using Stream stream = assembly.GetManifestResourceStream(resourceName)!;
        using var reader = new StreamReader(stream);
        return await reader.ReadToEndAsync();
    }

    private static T Deserialize<T>(this string json)
    {
        var result = JsonSerializer.Deserialize<T>(json);
        if (result is null)
        {
            throw new JsonException($"Failed to deserialize JSON: {json}");
        }

        return result;
    }
}

public sealed class ProjectTemplateKey : SmartEnum<ProjectTemplateKey>
{
    public static readonly ProjectTemplateKey TwelveRowsNoStrings =
        new(nameof(TwelveRowsNoStrings), 1);
    public static readonly ProjectTemplateKey TwelveRowsSixStrings =
        new(nameof(TwelveRowsSixStrings), 2);

    public static readonly ProjectTemplateKey TwelveRowsSixStringsWithLinks =
        new(nameof(TwelveRowsSixStringsWithLinks), 3);

    private ProjectTemplateKey(string name, int value)
        : base(name, value) { }
}
