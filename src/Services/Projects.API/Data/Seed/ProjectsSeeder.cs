using Microsoft.EntityFrameworkCore;

namespace Projects.API.Data.Seed;

public static class ProjectsSeeder
{
    public static async void InitializeDatabase(IApplicationBuilder app)
    {
        var getService =
            app.ApplicationServices.GetService<IServiceScopeFactory>()
            ?? throw new ArgumentNullException(nameof(IServiceScopeFactory));
        using var serviceScope = getService.CreateScope();

        var context = serviceScope.ServiceProvider.GetRequiredService<ProjectsContext>();

        await context.Database.ExecuteSqlAsync($"CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"");

        await context.Database.MigrateAsync();
        if (context.PanelConfigs.Any() is false)
        {
            foreach (var panelConfig in DefaultPanelConfigs.PanelConfigs)
                context.PanelConfigs.Add(panelConfig);
            await context.SaveChangesAsync();
        }
    }
}