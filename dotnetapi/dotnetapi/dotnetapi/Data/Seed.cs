using System.Text.Json;
using dotnetapi.Models.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace dotnetapi.Data;

public abstract class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager,
        RoleManager<AppRole> roleManager)
    {
        if (await userManager.Users.AnyAsync()) return;

        var userData = await File.ReadAllTextAsync("Data/user-data.json");
        var users = JsonSerializer.Deserialize<List<AppUser>>(userData);
        if (users == null) return;

        var roles = new List<AppRole>
        {
            new() { Name = "User" },
            new() { Name = "Admin" }
        };

        foreach (var role in roles) await roleManager.CreateAsync(role);

        foreach (var user in users)
        {
            user.UserName = user.UserName?.ToLower();
            await userManager.CreateAsync(user, "Pa$$w0rd");
            await userManager.AddToRoleAsync(user, "User");
        }

        var admin = new AppUser
        {
            UserName = "admin"
        };

        await userManager.CreateAsync(admin, "Pa$$w0rd");
        await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
    }
}