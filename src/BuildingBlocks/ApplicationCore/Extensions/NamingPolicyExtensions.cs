using System.Text.Json;

namespace ApplicationCore.Extensions;

public class NamingPolicyExtensions
{
    public class SnakeCaseNamingPolicy : JsonNamingPolicy
    {
        public override string ConvertName(string name)
        {
            return name.ToSnakeCase();
        }
    }

    public class CamelCaseNamingPolicy : JsonNamingPolicy
    {
        public override string ConvertName(string name)
        {
            return name.ToCamelCase();
        }
    }

    public class KebabCaseNamingPolicy : JsonNamingPolicy
    {
        public override string ConvertName(string name)
        {
            return name.ToKebabCase();
        }
    }

    public class PascalCaseNamingPolicy : JsonNamingPolicy
    {
        public override string ConvertName(string name)
        {
            return name.ToPascalCase();
        }
    }
}