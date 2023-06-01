using Identity.Domain.Auth;
using Infrastructure.Data.Seed;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.Application.Data.Seed;

public static class IdentityContextSeed
{
    public static async void InitializeDatabase(IApplicationBuilder app)
    {
        var getService =
            app.ApplicationServices.GetService<IServiceScopeFactory>()
            ?? throw new ArgumentNullException(nameof(IServiceScopeFactory));
        using var serviceScope = getService.CreateScope();

        var context = serviceScope.ServiceProvider.GetRequiredService<IdentityContext>();
        await context.Database.EnsureCreatedAsync();

        await DbExtensionSeed<IdentityContext>.CreateUuidOsspIfNotExists(context);
        await DbExtensionSeed<IdentityContext>.CreateDatabaseIfNotExists(context, "identity-db");

        await context.Database.MigrateAsync();
        /*if (context.PanelConfigs.Any() is false)
        {
            foreach (var panelConfig in DefaultPanelConfigs.PanelConfigs)
                context.PanelConfigs.Add(panelConfig);
            await context.SaveChangesAsync();
        }*/
    }

    public static async void InitializeDatabaseTable(IApplicationBuilder app)
    {
        var getService =
            app.ApplicationServices.GetService<IServiceScopeFactory>()
            ?? throw new ArgumentNullException(nameof(IServiceScopeFactory));
        using var serviceScope = getService.CreateScope();

        var context = serviceScope.ServiceProvider.GetRequiredService<IdentityContext>();

        await DbExtensionSeed<IdentityContext>.CreateUuidOsspIfNotExists(context);

        await context.Database.MigrateAsync();
        /*if (context.PanelConfigs.Any() is false)
        {
            foreach (var panelConfig in DefaultPanelConfigs.PanelConfigs)
                context.PanelConfigs.Add(panelConfig);
            await context.SaveChangesAsync();
        }*/
    }

    public static async Task SeedAll(
        UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager
    )
    {
        if (await userManager.Users.AnyAsync())
            return;

        await SeedRoles(roleManager);
        await SeedUsers(userManager);
    }

    private static async Task SeedRoles(RoleManager<AppRole> roleManager)
    {
        if (!await roleManager.RoleExistsAsync(AppRoles.Admin))
            await roleManager.CreateAsync(
                new AppRole
                {
                    // Id = Guid.NewGuid().ToString(),
                    Name = AppRoles.Admin
                }
            );

        if (!await roleManager.RoleExistsAsync(AppRoles.User))
            await roleManager.CreateAsync(
                new AppRole
                {
                    // Id = Guid.NewGuid().ToString(),
                    Name = AppRoles.User
                }
            );
    }

    private static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        if (await userManager.FindByNameAsync("Administrator") == null)
        {
            var user = new AppUser
            {
                // Id = Guid.NewGuid().ToString(),
                UserName = "Administrator",
                FirstName = "Administrator",
                LastName = "Administrator",
                PhotoUrl = "Administrator",
                DisplayName = "Administrator"
            };

            var result = await userManager.CreateAsync(user, "123Pa$$word!");

            if (result.Succeeded)
                await userManager.AddToRoleAsync(user, AppRoles.Admin);
        }

        if (await userManager.FindByNameAsync("TestBot1") == null)
        {
            var user = new AppUser
            {
                // Id = Guid.NewGuid().ToString(),
                UserName = "TestBot1",
                FirstName = "TestBot1",
                LastName = "TestBot1",
                PhotoUrl = "TestBot1",
                DisplayName = "TestBot1"
            };

            var result = await userManager.CreateAsync(user, "123Pa$$word!");

            if (result.Succeeded)
                await userManager.AddToRoleAsync(user, AppRoles.User);
        }

        if (await userManager.FindByNameAsync("TestBot2") == null)
        {
            var user = new AppUser
            {
                // Id = Guid.NewGuid().ToString(),
                UserName = "TestBot2",
                FirstName = "TestBot2",
                LastName = "TestBot2",
                PhotoUrl = "TestBot2",
                DisplayName = "TestBot2"
            };

            var result = await userManager.CreateAsync(user, "123Pa$$word!");

            if (result.Succeeded)
                await userManager.AddToRoleAsync(user, AppRoles.User);
        }
    }
}