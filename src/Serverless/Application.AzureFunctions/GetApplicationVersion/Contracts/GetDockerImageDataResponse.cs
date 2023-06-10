using System.Text.Json.Serialization;

namespace Application.AzureFunctions.GetApplicationVersion.Contracts;

public class GetDockerImageDataResponse
{
    [JsonPropertyName("count")]
    public int Count { get; set; }

    [JsonPropertyName("next")]
    public object? Next { get; set; }

    [JsonPropertyName("previous")]
    public object? Previous { get; set; }

    [JsonPropertyName("results")]
    // ReSharper disable once CollectionNeverUpdated.Global
    public List<DockerImageTagResult> Results { get; set; } = new();
}

public class DockerImageTagResult
{
    [JsonPropertyName("creator")]
    public int Creator { get; set; }

    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("images")]
    public List<DockerImageData> Images { get; } = new();

    [JsonPropertyName("last_updated")]
    public DateTime LastUpdated { get; set; }

    [JsonPropertyName("last_updater")]
    public int LastUpdater { get; set; }

    [JsonPropertyName("last_updater_username")]
    public string LastUpdaterUsername { get; set; } = default!;

    [JsonPropertyName("name")]
    public string Name { get; set; } = default!;

    [JsonPropertyName("repository")]
    public int Repository { get; set; }

    [JsonPropertyName("full_size")]
    public int FullSize { get; set; }

    [JsonPropertyName("v2")]
    public bool V2 { get; set; }

    [JsonPropertyName("tag_status")]
    public string TagStatus { get; set; } = default!;

    [JsonPropertyName("tag_last_pulled")]
    public DateTime TagLastPulled { get; set; }

    [JsonPropertyName("tag_last_pushed")]
    public DateTime TagLastPushed { get; set; }

    [JsonPropertyName("media_type")]
    public string MediaType { get; set; } = default!;

    [JsonPropertyName("content_type")]
    public string ContentType { get; set; } = default!;

    [JsonPropertyName("digest")]
    public string Digest { get; set; } = default!;
}

public class DockerImageData
{
    [JsonPropertyName("architecture")]
    public string Architecture { get; set; } = default!;

    [JsonPropertyName("features")]
    public string Features { get; set; } = default!;

    [JsonPropertyName("variant")]
    public object? Variant { get; set; }

    [JsonPropertyName("digest")]
    public string Digest { get; set; } = default!;

    [JsonPropertyName("os")]
    public string Os { get; set; } = default!;

    [JsonPropertyName("os_features")]
    public string OsFeatures { get; set; } = default!;

    [JsonPropertyName("os_version")]
    public object? OsVersion { get; set; }

    [JsonPropertyName("size")]
    public int Size { get; set; }

    [JsonPropertyName("status")]
    public string Status { get; set; } = default!;

    [JsonPropertyName("last_pulled")]
    public DateTime LastPulled { get; set; }

    [JsonPropertyName("last_pushed")]
    public DateTime LastPushed { get; set; }
}
