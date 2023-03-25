using System.Net;
using System.Net.Http.Headers;
using Bogus;
using FastEndpoints;
using FluentAssertions;
using Identity.API.Endpoints.Auth;
using Identity.Application.Data;
using Identity.Application.Services.Jwt;
using Identity.Application.Settings;
using Identity.Contracts.Responses;
using Identity.Domain.Auth;
using Infrastructure.Extensions;
using Infrastructure.Services;
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
    public async Task Should_Return_Success_With_Valid_Authentication()
    {
        // Arrange
        var user = await CreateUserAsync();
        var token = await GetAccessTokenAsync(user.Id.ToString(), user.UserName);
        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            token
        );

        // Act
        var (response, result) = await _client.POSTAsync<
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
    public async Task Should_Return_Unauthorized_Without_Authentication()
    {
        // Arrange
        var request = new HttpRequestMessage(HttpMethod.Post, "/auth/returning-user");

        // Act
        var response = await _client.SendAsync(request);

        // Assert
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
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

    private async Task<AppUser> CreateUserAsyncV2()
    {
        var user = _userRequestGenerator.Generate();
        var db = _apiWebFactory.Services.GetService<IdentityContext>();
        ArgumentNullException.ThrowIfNull(db);
        var createUserResult = await db.Users.AddAsync(user);
        await db.SaveChangesAsync();
        return createUserResult.Entity;
    }

    private async Task<string> GetAccessTokenAsync(string id, string userName)
    {
        var services = new ServiceCollection();
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        var config = new ConfigurationBuilder().AddJsonFile("appsettings.Development.json").Build();
        services.Configure<JwtSettings>(config.GetSection("Jwt"));
        /*services.Configure<JwtSettings>(settings =>
        {
            settings.Audience = "http://localhost:5000";
            settings.Issuer = "http://localhost:5000";
            settings.Key = "this is my custom Secret key for authentication";
        });*/

        var serviceProvider = services.BuildServiceProvider();
        var jwtTokenGenerator = serviceProvider.GetService<IJwtTokenGenerator>();
        ArgumentNullException.ThrowIfNull(jwtTokenGenerator);
        /*var serviceProvider = _server.Host.Services;
        var jwtTokenGenerator = serviceProvider.GetService<IJwtTokenGenerator>();
        ArgumentNullException.ThrowIfNull(jwtTokenGenerator);*/
        await Task.CompletedTask;
        return jwtTokenGenerator.GenerateToken(id, userName);
        // Replace with your own authentication logic to obtain an access token
        // For example, you could use IdentityServer4 or a mock authentication service
        /*var tokenRequest = new HttpRequestMessage(HttpMethod.Post, "/auth/token")
        {
            Content = new FormUrlEncodedContent(
                new Dictionary<string, string>
                {
                    { "grant_type", "password" },
                    { "username", "testuser" },
                    { "password", "testpassword" }
                }
            )
        };
        var tokenResponse = await _client.SendAsync(tokenRequest);
        var tokenContent = await tokenResponse.Content.ReadAsStringAsync();
        var tokenObject = JObject.Parse(tokenContent);
        return tokenObject.GetValue("access_token").ToString();*/
    }
}