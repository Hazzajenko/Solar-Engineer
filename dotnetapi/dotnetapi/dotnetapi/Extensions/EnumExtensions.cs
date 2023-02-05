using System.Collections.Concurrent;
using System.ComponentModel;
using System.Reflection;
using System.Text;

namespace dotnetapi.Extensions;

public static class EnumExtensions
{
    private static readonly
        ConcurrentDictionary<string, string> DisplayNameCache = new();

    public static string ToDisplayUpperSnakeCase(this Enum value)
    {
        return value.DisplayName().ToUpperSnakeCase();
    }

    public static string DisplayName(this Enum value)
    {
        var key = $"{value.GetType().FullName}.{value}";

        var displayName = DisplayNameCache.GetOrAdd(key, x =>
        {
            var name = (DescriptionAttribute[])value
                .GetType()
                .GetTypeInfo()
                .GetField(value.ToString())!
                .GetCustomAttributes(typeof(DescriptionAttribute), false);

            return name.Length > 0 ? name[0].Description : value.ToString();
        });

        return displayName;
    }

    public static string ToSnakeCase(this string text)
    {
        if (text == null) throw new ArgumentNullException(nameof(text));
        if (text.Length < 2) return text;
        var sb = new StringBuilder();
        sb.Append(char.ToLowerInvariant(text[0]));
        for (var i = 1; i < text.Length; ++i)
        {
            var c = text[i];
            if (char.IsUpper(c))
            {
                sb.Append('_');
                sb.Append(char.ToLowerInvariant(c));
            }
            else
            {
                sb.Append(c);
            }
        }

        return sb.ToString();
    }

    public static string ToUpperSnakeCase(this string text)
    {
        if (text == null) throw new ArgumentNullException(nameof(text));
        if (text.Length < 2) return text;
        var sb = new StringBuilder();
        sb.Append(char.ToLowerInvariant(text[0]));
        for (var i = 1; i < text.Length; ++i)
        {
            var c = text[i];
            if (char.IsUpper(c))
            {
                sb.Append('_');
                sb.Append(char.ToUpper(c));
            }
            else
            {
                sb.Append(char.ToUpper(c));
            }
        }

        return sb.ToString();
    }
}