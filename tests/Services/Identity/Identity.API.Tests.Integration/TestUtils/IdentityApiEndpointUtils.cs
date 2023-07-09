using System.Net.Http.Headers;
using Bogus;
using Identity.Application.Services.Jwt;
using Identity.Domain;
using Infrastructure.Services;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.API.Tests.Integration.TestUtils;

public static class IdentityApiEndpointUtils
{
    public static readonly Faker<AppUser> UserRequestGenerator = new Faker<AppUser>()
        .RuleFor(x => x.Id, faker => Guid.NewGuid())
        .RuleFor(x => x.UserName, faker => faker.Internet.UserName())
        .RuleFor(x => x.Email, faker => faker.Internet.Email())
        .RuleFor(x => x.FirstName, faker => faker.Name.FirstName())
        .RuleFor(x => x.LastName, faker => faker.Name.LastName())
        .RuleFor(x => x.PhotoUrl, faker => faker.Internet.Url());

    public static async Task<HttpClient> CreateAuthenticatedHttpClient<TFactory>(
        this WebApplicationFactory<TFactory> apiWebFactory
    )
        where TFactory : class
    {
        AppUser user = await apiWebFactory.CreateUserAsync();
        string token = GetAccessTokenAsync(user.Id.ToString(), user.UserName);
        HttpClient client = apiWebFactory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);
        return client;
    }

    private static async Task<AppUser> CreateUserAsync<TFactory>(
        this WebApplicationFactory<TFactory> apiWebFactory
    )
        where TFactory : class
    {
        AppUser? user = UserRequestGenerator.Generate();
        using IServiceScope scope = apiWebFactory.Services.CreateScope();
        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        ArgumentNullException.ThrowIfNull(userManager);
        IdentityResult createUserResult = await userManager.CreateAsync(user);

        if (!createUserResult.Succeeded)
            throw new Exception("Unable to create user");

        return user;
    }

    private static string GetAccessTokenAsync(string id, string userName)
    {
        var services = new ServiceCollection();
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        IConfigurationRoot config = new ConfigurationBuilder()
            .AddJsonFile("appsettings.Development.json")
            .Build();
        services.Configure<JwtSettings>(config.GetSection("Jwt"));

        ServiceProvider serviceProvider = services.BuildServiceProvider();
        var jwtTokenGenerator = serviceProvider.GetService<IJwtTokenGenerator>();
        ArgumentNullException.ThrowIfNull(jwtTokenGenerator);
        return jwtTokenGenerator.GenerateToken(id, userName);
    }
}
