using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using ApplicationCore.Extensions;
using Bogus;
using FastEndpoints;
using FluentAssertions;
using Identity.API.Endpoints.Auth;
using Identity.API.Endpoints.Users;
using Identity.Application.Services.Jwt;
using Identity.Contracts.Data;
using Identity.Contracts.Responses;
using Identity.Domain;
using Infrastructure.Services;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.API.Tests.Integration.Endpoints.Users;

public class GetUserByIdEndpointTests : IClassFixture<ApiWebFactory>
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

    public GetUserByIdEndpointTests(ApiWebFactory apiWebFactory)
    {
        _apiWebFactory = apiWebFactory;
        _client = apiWebFactory.CreateClient();
    }

    [Fact]
    public async Task HandleGetUserByIdEndpoint_WhenUserIdIsValid_ShouldReturnUserDto()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = await CreateAuthenticatedUserAsync();

        AppUser otherUser = await CreateOtherUserAsync();
        var otherUserId = otherUser.Id.ToString();

        // Act
        HttpResponseMessage response = await _client.GetAsync($"/user/{otherUserId}");
        var result = await response.Content.ReadFromJsonAsync<AppUserDto?>();

        // Assert
        response.Should().NotBeNull();
        response!.StatusCode.Should().Be(HttpStatusCode.OK);
        result.Should().NotBeNull();

        result!.Id.Should().Be(otherUser.Id.ToString());
        result!.Id.Should().Match(x => x.TryToGuid());
        result!.UserName.Should().Be(otherUser.UserName);
    }

    [Fact]
    public async Task HandleGetUserByIdEndpoint_WhenUserIdIsNotValid_ShouldReturnNotFound()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = await CreateAuthenticatedUserAsync();

        // Act
        HttpResponseMessage response = await _client.GetAsync($"/user/{Guid.NewGuid()}");
        AppUserDto? result = null;
        if (response.IsSuccessStatusCode)
        {
            result = await response.Content.ReadFromJsonAsync<AppUserDto>();
        }

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        result.Should().BeNull();
    }

    [Fact]
    public async Task HandleGetUserByIdEndpoint_WhenUserIdIsNull_ShouldReturnNotFound()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = await CreateAuthenticatedUserAsync();

        // Act
        HttpResponseMessage response = await _client.GetAsync("/user/");
        AppUserDto? result = null;
        if (response.IsSuccessStatusCode)
        {
            result = await response.Content.ReadFromJsonAsync<AppUserDto>();
        }

        // Assert
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        result.Should().BeNull();
    }

    private async Task<AuthenticationHeaderValue> CreateAuthenticatedUserAsync()
    {
        AppUser user = await CreateUserAsync();
        var token = await GetAccessTokenAsync(user.Id.ToString(), user.UserName);
        return new AuthenticationHeaderValue("Bearer", token);
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

    private async Task<AppUser> CreateOtherUserAsync()
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
        var config = new ConfigurationBuilder().AddJsonFile("appsettings.Development.json").Build();
        services.Configure<JwtSettings>(config.GetSection("Jwt"));

        var serviceProvider = services.BuildServiceProvider();
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
        var config = new ConfigurationBuilder().AddJsonFile("appsettings.Development.json").Build();
        services.Configure<JwtSettings>(config.GetSection("Jwt"));

        var serviceProvider = services.BuildServiceProvider();
        var jwtTokenGenerator = serviceProvider.GetService<IJwtTokenGenerator>();
        ArgumentNullException.ThrowIfNull(jwtTokenGenerator);
        return jwtTokenGenerator.GenerateToken(Guid.NewGuid(), "invalid-user");
    }

    private string CreateUrl(string? userId = null)
    {
        return $"https://localhost:5000/user/{userId}";
    }
}
