using Auth.API.Domain;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Auth.API.Data;

public class AuthContextSeed
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
            await roleManager.CreateAsync(new(){Name = Constants.Role.Admin});

        if (!await roleManager.RoleExistsAsync(Constants.Role.User))
            await roleManager.CreateAsync(new(){Name = Constants.Role.User});
    }

    private static async Task SeedUsers(UserManager<AppUser> userManager)
    {
        if (await userManager.FindByNameAsync("Administrator") == null)
        {
            var user = new AppUser
            {
                UserName = "Administrator",
                FirstName = "Administrator",
                LastName = "Administrator",
                PhotoUrl = "Administrator",
                DisplayName = "Administrator"
            };

            var result = await userManager.CreateAsync(user, "123Pa$$word!");

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, Constants.Role.Admin);
            }
        }

        if (await userManager.FindByNameAsync("TestBot") == null)
        {
            var user = new AppUser
            {
                UserName = "TestBot",
                FirstName = "TestBot",
                LastName = "TestBot",
                PhotoUrl = "TestBot",
                DisplayName = "TestBot"
            };

            var result = await userManager.CreateAsync(user, "123Pa$$word!");

            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(user, Constants.Role.User);
            }
        }
    }
}
