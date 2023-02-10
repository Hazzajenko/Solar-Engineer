using Auth.API.Domain;

using Microsoft.AspNetCore.Identity;

namespace Auth.API.Data;

public class AuthDataSeeder : IDataSeeder
{
    private readonly RoleManager<IdentityRole<int>> _roleManager;
    private readonly UserManager<AppUser> _userManager;

    public AuthDataSeeder(UserManager<AppUser> userManager,
        RoleManager<IdentityRole<int>> roleManager)
    {
        _userManager = userManager;
        _roleManager = roleManager;
    }

    public async Task SeedAllAsync()
    {
        await SeedRoles();
        await SeedUsers();
    }

    private async Task SeedRoles()
    {
        if (!await _roleManager.RoleExistsAsync(Constants.Role.Admin))
            await _roleManager.CreateAsync(new(Constants.Role.Admin));

        if (!await _roleManager.RoleExistsAsync(Constants.Role.User))
            await _roleManager.CreateAsync(new(Constants.Role.User));
    }

    private async Task SeedUsers()
    {
        if (await _userManager.FindByNameAsync("Administrator") == null)
        {
            var user = new AppUser
            {
                UserName = "Administrator"
            };

            var result = await _userManager.CreateAsync(user, "123Pa$$word!");

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, Constants.Role.Admin);
            }
        }

        if (await _userManager.FindByNameAsync("TestBot") == null)
        {
            var user = new AppUser
            {
                UserName = "TestBot",
            };

            var result = await _userManager.CreateAsync(user, "123Pa$$word!");

            if (result.Succeeded)
            {
                await _userManager.AddToRoleAsync(user, Constants.Role.User);
            }
        }
    }
}
