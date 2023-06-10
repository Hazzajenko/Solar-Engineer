using System.Text.Json.Serialization;

namespace Application.AzureFunctions.GetApplicationVersion.Contracts;

public class GetTokenRequest
{
    [JsonPropertyName("username")]
    public required string UserName { get; set; }

    [JsonPropertyName("password")]
    public required string Password { get; set; }
}