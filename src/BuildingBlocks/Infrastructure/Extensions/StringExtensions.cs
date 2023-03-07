using System.Text;

namespace Infrastructure.Extensions;

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

    public static Guid TryToGuid<TException>(this string id, TException exception)
        where TException : Exception
    {
        try
        {
            return Guid.Parse(id);
        }
        catch (Exception e)
        {
            throw exception;
        }
    }
}