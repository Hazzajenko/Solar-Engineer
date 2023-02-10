using Auth.API.Data;

using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
namespace Auth.API.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder ConfigureMigrations<T>(this IApplicationBuilder applicationBuilder, IWebHostEnvironment webHostEnvironment)
        where T : DbContext
    {
        MigrateDatabaseAsync<T>(applicationBuilder.ApplicationServices).GetAwaiter().GetResult();
        if (webHostEnvironment.IsDevelopment() || webHostEnvironment.EnvironmentName == "docker")
        {
            SeedDataAsync(applicationBuilder.ApplicationServices).GetAwaiter().GetResult();
        }
        return applicationBuilder;
    }
    private static async Task MigrateDatabaseAsync<T>(IServiceProvider serviceProvider)
        where T : DbContext
    {
        using var scope = serviceProvider.CreateScope();
        var logService = scope.ServiceProvider.GetRequiredService<ILogger<IDbContext>>();
        var context = scope.ServiceProvider.GetRequiredService<T>();
        if ((await context.Database.GetPendingMigrationsAsync()).Any())
        {
            logService.LogInformation("Applying Migrations for {TypeName}", typeof(T).Name);
            await context.Database.MigrateAsync();
        }
    }
    private static async Task SeedDataAsync(IServiceProvider serviceProvider)
    {
        using var scope = serviceProvider.CreateScope();
        foreach (var seeder in scope.ServiceProvider.GetServices<IDataSeeder>())
        {
            await seeder.SeedAllAsync();
        }
    }
}