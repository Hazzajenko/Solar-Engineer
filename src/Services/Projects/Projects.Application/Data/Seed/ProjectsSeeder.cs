using Infrastructure.Data.Seed;
using Microsoft.AspNetCore.Builder;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Projects.Application.Data.Seed;

public static class ProjectsSeeder
{
    public static async void InitializeDatabase(IApplicationBuilder app)
    {
        var getService =
            app.ApplicationServices.GetService<IServiceScopeFactory>()
            ?? throw new ArgumentNullException(nameof(IServiceScopeFactory));
        using var serviceScope = getService.CreateScope();

        var context = serviceScope.ServiceProvider.GetRequiredService<ProjectsContext>();

        await DbExtensionSeed<ProjectsContext>.CreateUuidOsspIfNotExists(context);

        await context.Database.MigrateAsync();
        if (context.PanelConfigs.Any() is false)
        {
            foreach (var panelConfig in DefaultPanelConfigs.PanelConfigs)
                context.PanelConfigs.Add(panelConfig);
            await context.SaveChangesAsync();
        }
    }
}
// await context.Database.ExecuteSqlAsync($"CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"");