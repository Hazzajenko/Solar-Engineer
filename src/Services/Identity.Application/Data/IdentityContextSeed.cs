using Identity.Application.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Identity.Application.Data;

public class IdentityContextSeed
{
    public static async Task SeedAll(UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager)
    {
        if (await userManager.Users.AnyAsync()) return;

        await SeedRoles(roleManager);
        await SeedUsers(userManager);
    }

    private static async Task SeedRoles(
        RoleManager<AppRole> roleManager)
    {
        if (!await roleManager.RoleExistsAsync(Constants.Role.Admin))
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
            });
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

            if (result.Succeeded) await userManager.AddToRoleAsync(user, Constants.Role.Admin);
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

            if (result.Succeeded) await userManager.AddToRoleAsync(user, Constants.Role.User);
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

            if (result.Succeeded) await userManager.AddToRoleAsync(user, Constants.Role.User);
        }
    }
}