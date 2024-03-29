﻿using System.Text;
using System.Text.RegularExpressions;
using Serilog;

namespace ApplicationCore.Extensions;

public static class StringExtensions
{
    public static string ToSnakeCase(this string text)
    {
        if (text == null)
            throw new ArgumentNullException(nameof(text));
        if (text.Length < 2)
            return text;
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

    public static Guid ToGuid(this string id)
    {
        return Guid.Parse(id);
    }

    public static bool TryParseGuid(this string id, out Guid guid)
    {
        return Guid.TryParse(id, out guid);
    }

    public static bool TryToGuid(this string id)
    {
        return Guid.TryParse(id, out _);
    }

    public static Guid TryToGuidOrThrow<TException>(this string id, TException exception)
        where TException : Exception
    {
        try
        {
            return Guid.Parse(id);
        }
        catch (Exception e)
        {
            Log.Logger.Error(e, "Error in TryToGuidOrThrow");
            throw exception;
        }
    }

    public static bool IsStringNullOrEmpty(this string s)
    {
        return string.IsNullOrEmpty(s);
    }

    /*public static Guid TryToGuid(this string id)
    {
        try
        {
            return Guid.TryParse(id);
        }
        catch (Exception e)
        {
            throw exception;
        }
    }*/

    public static string ToCamelCase(this string s)
    {
        var x = s.Replace("_", "");
        if (x.Length == 0)
            return "null";
        x = Regex.Replace(
            x,
            "([A-Z])([A-Z]+)($|[A-Z])",
            m => m.Groups[1].Value + m.Groups[2].Value.ToLower() + m.Groups[3].Value
        );
        return char.ToLower(x[0]) + x.Substring(1);
    }

    public static string ToPascalCase(this string s)
    {
        var x = s.ToCamelCase();
        return char.ToUpper(x[0]) + x.Substring(1);
    }

    public static string ToKebabCase(this string str)
    {
        if (string.IsNullOrWhiteSpace(str))
            return str;

        return Regex.Replace(str, @"([a-z0-9])([A-Z])", "$1-$2", RegexOptions.Compiled).ToLower();
    }

    /*public static string ToKebabCase(this string s)
    {
        var x = s.Replace("_", "-");
        if (x.Length == 0)
            return "null";
        x = Regex.Replace(
            x,
            "([A-Z])([A-Z]+)($|[A-Z])",
            m => m.Groups[1].Value + m.Groups[2].Value.ToLower() + m.Groups[3].Value
        );
        return char.ToLower(x[0]) + x.Substring(1);
    }*/

    public static string PascalCaseConverter(string s)
    {
        var x = s.ToCamelCase();
        return char.ToUpper(x[0]) + x.Substring(1);
    }
}
