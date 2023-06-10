using System.Text.Json.Serialization;

namespace Application.AzureFunctions.GetApplicationVersion.Contracts;

public class GetTokenResponse
{
    [JsonPropertyName("token")]
    public string Token { get; set; } = default!;
}
