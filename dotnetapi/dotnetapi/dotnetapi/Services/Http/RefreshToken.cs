using System.Text.Json.Serialization;

namespace dotnetapi.Services.Http;

public class RefreshTokenRequest
{
    [JsonPropertyName("grant_type")] public string GrantType { get; set; } = "refresh_token";

    [JsonPropertyName("client_id")] public string ClientId { get; set; } = default!;

    [JsonPropertyName("client_secret")] public string ClientSecret { get; set; } = default!;

    [JsonPropertyName("refresh_token")] public string RefreshToken { get; set; } = default!;
}

public class RefreshTokenResponse
{
    [JsonPropertyName("access_token")] public string AccessToken { get; set; } = default!;

    [JsonPropertyName("expires_in")] public int ExpiresIn { get; set; }

    [JsonPropertyName("scope")] public string Scope { get; set; } = default!;

    [JsonPropertyName("id_token")] public string IdToken { get; set; } = default!;

    [JsonPropertyName("token_type")] public string TokenType { get; set; } = default!;
}