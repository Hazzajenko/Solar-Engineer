using System.Net;
using System.Net.Http.Headers;
using ApplicationCore.Extensions;
using Bogus;
using FastEndpoints;
using FluentAssertions;
using Identity.API.Endpoints.Auth;
using Identity.Application.Data;
using Identity.Application.Services.Jwt;
using Identity.Contracts.Responses;
using Identity.Domain;
using Infrastructure.Extensions;
using Infrastructure.Services;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.API.Tests.Integration.Endpoints.Auth;

public class IsReturningUserEndpointTests : IClassFixture<ApiWebFactory>
{
    private readonly ApiWebFactory _apiWebFactory;
    private readonly HttpClient _client;

    private readonly Faker<AppUser> _userRequestGenerator = new Faker<AppUser>()
        .RuleFor(x => x.Id, faker => Guid.NewGuid())
        .RuleFor(x => x.UserName, faker => faker.Internet.UserName())
        .RuleFor(x => x.Email, faker => faker.Internet.Email())
        .RuleFor(x => x.FirstName, faker => faker.Name.FirstName())
        .RuleFor(x => x.LastName, faker => faker.Name.LastName())
        .RuleFor(x => x.PhotoUrl, faker => faker.Internet.Url());

    public IsReturningUserEndpointTests(ApiWebFactory apiWebFactory)
    {
        _apiWebFactory = apiWebFactory;
        _client = apiWebFactory.CreateClient();
    }

    [Fact]
    public async Task HandleIsReturningUserEndpoint_WhenAuthenticatedUserIsReturning_ShouldReturnSuccess()
    {
        // Arrange
        AppUser user = await CreateUserAsync();
        var token = await GetAccessTokenAsync(user.Id.ToString(), user.UserName);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            token
        );

        // Act
        (HttpResponseMessage response, AuthorizeResponse? result) = await _client.POSTAsync<
            IsReturningUserEndpoint,
            AuthorizeResponse
        >();

        // Assert
        response.Should().NotBeNull();
        response!.StatusCode.Should().Be(HttpStatusCode.OK);
        result.Should().NotBeNull();

        result!.User.Id.Should().Be(user.Id.ToString());
        result!.User.Id.Should().Match(x => x.TryToGuid());
        result!.User.UserName.Should().Be(user.UserName);
    }

    [Fact]
    public async Task HandleIsReturningUserEndpoint_WhenNotValidUserIsReturning_ShouldReturnUnauthorized()
    {
        // Arrange
        var invalidToken = GetInvalidAccessTokenAsync();
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            invalidToken
        );

        // Act
        (HttpResponseMessage response, AuthorizeResponse? result) = await _client.POSTAsync<
            IsReturningUserEndpoint,
            AuthorizeResponse
        >();

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }

    private async Task<AppUser> CreateUserAsync()
    {
        AppUser? user = _userRequestGenerator.Generate();

        using IServiceScope scope = _apiWebFactory.Services.CreateScope();

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        ArgumentNullException.ThrowIfNull(userManager);
        IdentityResult createUserResult = await userManager.CreateAsync(user);

        if (!createUserResult.Succeeded)
            throw new Exception("Unable to create user");

        return user;
    }

    private async Task<string> GetAccessTokenAsync(string id, string userName)
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
        await Task.CompletedTask;
        return jwtTokenGenerator.GenerateToken(id, userName);
    }

    private static string GetInvalidAccessTokenAsync()
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
        return jwtTokenGenerator.GenerateToken(Guid.NewGuid(), "invalid-user");
    }
}
