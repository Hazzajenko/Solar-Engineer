using System.Text.Json.Serialization;

namespace Auth.API.Settings;

public class AuthSettings
{
    [JsonPropertyName("client_id")] public string ClientId { get; set; } = string.Empty;

    [JsonPropertyName("client_secret")] public string ClientSecret { get; set; } = string.Empty;

    [JsonPropertyName("audience")] public string Audience { get; set; } = string.Empty;

    [JsonPropertyName("grant_type")] public string GrantType { get; set; } = string.Empty;
}