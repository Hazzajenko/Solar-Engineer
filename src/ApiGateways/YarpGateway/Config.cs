namespace YarpGateway;

public static class ProxyConfig
{
    public static IServiceCollection ConfigureProxy(this IServiceCollection services)
    {
        /*var routes = new[]
        {
            new RouteConfig()
            {
                RouteId = "route1",
                ClusterId = "cluster1",
                Match =
                {
                    Path = "{**catch-all}"
                }
            }
        };
        var clusters = new[]
        {
            new ClusterConfig()
            {
                ClusterId = "cluster1",
                Destinations =
                {
                    // { "destination0", new DestinationConfig{ Address = "https://localhost:10001" } },
                    { "destination1", new DestinationConfig{ Address = "https://localhost:10000" } }
                },
                HttpClient = new HttpClientConfig { MaxConnectionsPerServer = 10, SslProtocols = SslProtocols.Tls11 | SslProtocols.Tls12 }
            }
        };
        services.AddReverseProxy()
        .LoadFromMemory(routes, clusters);*/
        return services;
    }
}