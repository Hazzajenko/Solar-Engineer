using System.Globalization;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;
using Ardalis.SmartEnum;
using Serilog;

namespace Projects.Contracts.Data;

[JsonConverter(typeof(ProjectTemplateKeyConverter))]
public abstract class ProjectTemplateKey : SmartEnum<ProjectTemplateKey>
{
    public static readonly ProjectTemplateKey Blank = new BlankTemplate();
    public static readonly ProjectTemplateKey TwelveRowsNoStrings =
        new TwelveRowsNoStringsTemplate();
    public static readonly ProjectTemplateKey TwelveRowsSixStrings =
        new TwelveRowsSixStringsTemplate();
    public static readonly ProjectTemplateKey TwelveRowsSixStringsWithLinks =
        new TwelveRowsSixStringsWithLinksTemplate();

    private ProjectTemplateKey(string name, int value)
        : base(name, value) { }

    public abstract string JsonFileName { get; }

    private sealed class BlankTemplate : ProjectTemplateKey
    {
        public BlankTemplate()
            : base(nameof(Blank), 0) { }

        public override string JsonFileName => "blank.json";
    }

    private sealed class TwelveRowsNoStringsTemplate : ProjectTemplateKey
    {
        public TwelveRowsNoStringsTemplate()
            : base(nameof(TwelveRowsNoStrings), 1) { }

        public override string JsonFileName => "12-rows-no-strings.template.json";
    }

    private sealed class TwelveRowsSixStringsTemplate : ProjectTemplateKey
    {
        public TwelveRowsSixStringsTemplate()
            : base(nameof(TwelveRowsSixStrings), 2) { }

        public override string JsonFileName => "12-rows-6-strings.template.json";
    }

    private sealed class TwelveRowsSixStringsWithLinksTemplate : ProjectTemplateKey
    {
        public TwelveRowsSixStringsWithLinksTemplate()
            : base(nameof(TwelveRowsSixStringsWithLinks), 3) { }

        public override string JsonFileName => "12-rows-6-strings-with-links.template.json";
    }
}

public class ProjectTemplateKeyConverter : JsonConverter<ProjectTemplateKey>
{
    public override ProjectTemplateKey Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options
    )
    {
        var enumString = reader.GetString();

        Log.Logger.Information("ProjectTemplateKeyConverter.Read: {EnumString}", enumString);
        var fields = typeof(ProjectTemplateKey)
            .GetFields(BindingFlags.Public | BindingFlags.Static)
            .Where(f => f.FieldType == typeof(ProjectTemplateKey));

        foreach (var field in fields)
        {
            Log.Logger.Information(
                "ProjectTemplateKeyConverter.Read: {EnumString} == {FieldName}",
                enumString,
                field.Name
            );
            if (field.Name.Equals(enumString, StringComparison.OrdinalIgnoreCase))
            {
                return ProjectTemplateKey.FromName(field.Name);
                // return (ProjectTemplateKey)field.GetValue(null);
            }
        }
        throw new JsonException(
            $"Unable to convert \"{enumString}\" to enum {typeof(ProjectTemplateKey)}."
        );
    }

    public override void Write(
        Utf8JsonWriter writer,
        ProjectTemplateKey value,
        JsonSerializerOptions options
    )
    {
        writer.WriteStringValue(value.Name);
    }
}
