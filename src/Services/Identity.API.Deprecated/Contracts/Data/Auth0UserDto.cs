namespace Identity.API.Deprecated.Contracts.Data;

public class Auth0UserDto
{
    public DateTime CreatedAt { get; set; }

    public string Email { get; set; } = default!;

    public bool EmailVerified { get; set; }

    public string FamilyName { get; set; } = default!;

    public string GivenName { get; set; } = default!;

    public List<Identity> Identities { get; set; } = default!;

    public string Locale { get; set; } = default!;

    public string Name { get; set; } = default!;

    public string Nickname { get; set; } = default!;

    public string Picture { get; set; } = default!;

    public DateTime UpdatedAt { get; set; }

    public string UserId { get; set; } = default!;

    public string LastIp { get; set; } = default!;

    public DateTime LastLogin { get; set; }

    public int LoginsCount { get; set; }
}

public class Identity
{
    public string Provider { get; set; } = default!;

    public string AccessToken { get; set; } = default!;

    public int ExpiresIn { get; set; }

    public string UserId { get; set; } = default!;

    public string Connection { get; set; } = default!;

    public bool IsSocial { get; set; }
}

/*public class Auth0User
{
    [JsonPropertyName("created_at")] public DateTime CreatedAt { get; set; }

    [JsonPropertyName("email")] public string Email { get; set; } = default!;

    [JsonPropertyName("email_verified")] public bool EmailVerified { get; set; }

    [JsonPropertyName("family_name")] public string FamilyName { get; set; } = default!;

    [JsonPropertyName("given_name")] public string GivenName { get; set; } = default!;

    [JsonPropertyName("identities")] public List<Identity> Identities { get; set; } = default!;

    [JsonPropertyName("locale")] public string Locale { get; set; } = default!;

    [JsonPropertyName("name")] public string Name { get; set; } = default!;

    [JsonPropertyName("nickname")] public string Nickname { get; set; } = default!;

    [JsonPropertyName("picture")] public string Picture { get; set; } = default!;

    [JsonPropertyName("updated_at")] public DateTime UpdatedAt { get; set; }

    [JsonPropertyName("user_id")] public string UserId { get; set; } = default!;

    [JsonPropertyName("last_ip")] public string LastIp { get; set; } = default!;

    [JsonPropertyName("last_login")] public DateTime LastLogin { get; set; }

    [JsonPropertyName("logins_count")] public int LoginsCount { get; set; }
}*/
/*public class Identity
{
    [JsonPropertyName("provider")] public string Provider { get; set; } = default!;

    [JsonPropertyName("access_token")] public string AccessToken { get; set; } = default!;

    [JsonPropertyName("expires_in")] public int ExpiresIn { get; set; }

    [JsonPropertyName("user_id")] public string UserId { get; set; } = default!;

    [JsonPropertyName("connection")] public string Connection { get; set; } = default!;

    [JsonPropertyName("isSocial")] public bool IsSocial { get; set; }
}*/