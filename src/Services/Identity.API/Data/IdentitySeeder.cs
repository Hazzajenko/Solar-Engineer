using Duende.IdentityServer.EntityFramework.DbContexts;
using Duende.IdentityServer.EntityFramework.Mappers;
using Identity.API.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Identity.API.Data;

public static class IdentitySeeder
{
    /*public static async Task SeedAll(UserManager<AppUser> userManager)
    {
        if (await userManager.Users.AnyAsync()) return;

        // await SeedRoles(roleManager);
        await SeedUsers(userManager);
    }*/

    /*private static async Task SeedRoles(
        RoleManager<AppRole> roleManager)
    {
        /*if (!await roleManager.RoleExistsAsync(Constants.Role.Admin))
            await roleManager.CreateAsync(new AppRole
            {
                // Id = Guid.NewGuid().ToString(),
                Name = Constants.Role.Admin
            });

        if (!await roleManager.RoleExistsAsync(Constants.Role.User))
            await roleManager.CreateAsync(new AppRole
            {
                // Id = Guid.NewGuid().ToString(),
                Name = Constants.Role.User
            });#1#
    }*/


    public static async void InitializeDatabase(IApplicationBuilder app)
    {
        var getService = app.ApplicationServices.GetService<IServiceScopeFactory>() ??
                         throw new ArgumentNullException(nameof(IServiceScopeFactory));
        using var serviceScope = getService.CreateScope();

        await serviceScope.ServiceProvider.GetRequiredService<IdentityContext>().Database.MigrateAsync();
        var userManager = serviceScope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();

        if (!userManager.Users.Any()) await SeedUsers(userManager);

        await serviceScope.ServiceProvider.GetRequiredService<PersistedGrantDbContext>().Database.MigrateAsync();

        var context = serviceScope.ServiceProvider.GetRequiredService<ConfigurationDbContext>();
        await context.Database.MigrateAsync();
        /*if (!context.Clients.Any())
        {*/
        // foreach (var client in IdentityConfig.Clients) context.Clients.Add(client.ToEntity());
        foreach (var client in IdentityConfig.Clients)
        {
            var getClient = await context.Clients.SingleOrDefaultAsync(x => x.ClientId == client.ClientId);
            if (getClient is null) await context.Clients.AddAsync(client.ToEntity());
        }


        await context.SaveChangesAsync();
        // }

        if (!context.IdentityResources.Any())
        {
            foreach (var resource in IdentityConfig.IdentityResources)
                context.IdentityResources.Add(resource.ToEntity());
            await context.SaveChangesAsync();
        }

        if (!context.ApiScopes.Any())
        {
            foreach (var resource in IdentityConfig.ApiScopes) context.ApiScopes.Add(resource.ToEntity());
            await context.SaveChangesAsync();
        }
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

            // if (result.Succeeded) await userManager.AddToRoleAsync(user, Constants.Role.Admin);
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

            // if (result.Succeeded) await userManager.AddToRoleAsync(user, Constants.Role.User);
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

            // if (result.Succeeded) await userManager.AddToRoleAsync(user, Constants.Role.User);
        }
    }
}