namespace Infrastructure.Config;

public class UrlsConfig
{
    public string Auth { get; set; } = default!;
    public string Users { get; set; } = default!;
    public string GrpcAuth { get; set; } = default!;
    public string GrpcUsers { get; set; } = default!;
}