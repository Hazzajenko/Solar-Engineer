using System.Net;
using System.Net.Http.Headers;
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

public class AuthorizeEndpointTests : IClassFixture<ApiWebFactory>
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

    public AuthorizeEndpointTests(ApiWebFactory apiWebFactory)
    {
        _apiWebFactory = apiWebFactory;
        _client = apiWebFactory.CreateClient();
    }

    [Fact]
    public async Task Authorize_ReturnsOkResponse_WhenAuthorized()
    {
        // Arrange
        // var mediator = GetRequiredService<IMediator>();
        // var userManager = GetRequiredService<UserManager<AppUser>>();
        // var jwtTokenGenerator = GetRequiredService<IJwtTokenGenerator>();
        var userManager = _apiWebFactory.Services.GetService<UserManager<AppUser>>();
        ArgumentNullException.ThrowIfNull(userManager);

        // Create a new user to authorize
        // var user = new AppUser { UserName = "testuser" };
        var user = _userRequestGenerator.Generate();
        var createUserResult = await userManager.CreateAsync(user);
        // await Create
        // var result = await userManager.CreateAsync(user);
        if (!createUserResult.Succeeded)
            throw new Exception("Failed to create test user.");

        var jwtTokenGenerator = _apiWebFactory.Services.GetService<IJwtTokenGenerator>();
        ArgumentNullException.ThrowIfNull(jwtTokenGenerator);
        var token = jwtTokenGenerator.GenerateToken(user.Id.ToString(), user.UserName);

        // var token = await GetAccessTokenAsync(user.Id.ToString(), user.UserName);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            token
        );
        // Act
        // var response = await ExecuteAsync(principal, endpoint);
        var (response, result) = await _client.POSTAsync<AuthorizeEndpoint, AuthorizeResponse>();

        // Assert
        response.Should().NotBeNull();
        response!.StatusCode.Should().Be(HttpStatusCode.OK);
        result.Should().NotBeNull();

        result!.User.Id.Should().Be(user.Id.ToString());
        result!.User.Id.Should().Match(x => x.TryToGuid());
        result!.User.UserName.Should().Be(user.UserName);
    }

    private async Task<AppUser> CreateUserAsync()
    {
        var user = _userRequestGenerator.Generate();
        var userManager = _apiWebFactory.Services.GetService<UserManager<AppUser>>();
        ArgumentNullException.ThrowIfNull(userManager);
        var createUserResult = await userManager.CreateAsync(user);

        if (!createUserResult.Succeeded)
            throw new Exception("Unable to create user");

        var addRoleResult = await userManager.AddToRoleAsync(user, AppRoles.User);
        if (!addRoleResult.Succeeded)
            throw new Exception("Unable to add role to user");

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
}
