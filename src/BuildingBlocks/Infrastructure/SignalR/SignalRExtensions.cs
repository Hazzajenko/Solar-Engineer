using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace Infrastructure.SignalR;

public static class SignalRExtensions
{
    public static IServiceCollection ConfigureSignalRWithRedis(this IServiceCollection services,
        IWebHostEnvironment env)
    {
        services.AddSignalR(options =>
        {
            options.DisableImplicitFromServicesParameters = true;
            if (env.IsDevelopment()) options.EnableDetailedErrors = true;
        }).AddStackExchangeRedis("localhost", options => { options.Configuration.ChannelPrefix = "SolarEngineerApp"; });
        return services;
    }
}