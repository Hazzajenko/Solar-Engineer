using System.Text.Json;

namespace Auth.API.Extensions;

public class NamingPolicyExtensions
{

    public class SnakeCaseNamingPolicy : JsonNamingPolicy
    {
        public override string ConvertName(string name)
        {
            return name.ToSnakeCase();
        }
    }
}