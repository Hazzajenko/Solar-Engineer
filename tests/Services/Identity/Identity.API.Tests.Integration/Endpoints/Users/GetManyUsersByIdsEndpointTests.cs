using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using Bogus;
using FastEndpoints;
using FluentAssertions;
using Identity.API.Endpoints.Users;
using Identity.Application.Handlers.AppUsers;
using Identity.Application.Services.Jwt;
using Identity.Contracts.Data;
using Identity.Domain;
using Infrastructure.Services;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Identity.API.Tests.Integration.Endpoints.Users;

public class GetManyUsersByIdsEndpointTests : IClassFixture<ApiWebFactory>
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

    public GetManyUsersByIdsEndpointTests(ApiWebFactory apiWebFactory)
    {
        _apiWebFactory = apiWebFactory;
        _client = apiWebFactory.CreateClient();
    }

    [Fact]
    public async Task HandleGetManyUsersByIdsEndpoint_WhenUserIdsAreValid_ShouldReturnWebUserDtoList()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = await CreateAuthenticatedUserAsync();
        var otherUsers = await CreateManyUsersAsync();
        var request = new GetManyUsersByIdsRequest
        {
            AppUserIds = otherUsers.Select(x => x.Id.ToString()).ToList()
        };

        // Act
        (HttpResponseMessage response, GetManyUsersByIdsResponse? result) = await _client.POSTAsync<
            GetManyUsersByIdsEndpoint,
            GetManyUsersByIdsRequest,
            GetManyUsersByIdsResponse
        >(request);

        // Assert
        response.Should().NotBeNull();
        response!.StatusCode.Should().Be(HttpStatusCode.OK);
        result.Should().NotBeNull();
        result!.AppUsers.Should().NotBeEmpty();
        result!.AppUsers.Should().HaveCount(otherUsers.Count());
        foreach (WebUserDto resultAppUser in result.AppUsers)
        {
            resultAppUser.Id.Should().NotBeEmpty();
            resultAppUser.Id.Should().Match(x => x.TryToGuid());
            resultAppUser.UserName.Should().NotBeEmpty();
            resultAppUser.Id
                .Should()
                .Match(x => otherUsers.Any(y => y.Id.ToString() == x.ToString()));
        }
    }

    [Fact]
    public async Task HandleGetManyUsersByIdsEndpoint_WhenUserIdsAreNotValid_ShouldReturnBadRequest()
    {
        // Arrange
        _client.DefaultRequestHeaders.Authorization = await CreateAuthenticatedUserAsync();
        var invalidUserIds = Enumerable.Range(0, 5).Select(_ => Guid.NewGuid().ToString()).ToList();
        var request = new GetManyUsersByIdsRequest { AppUserIds = invalidUserIds };

        // Act
        (HttpResponseMessage response, ErrorResponse? result) = await _client.POSTAsync<
            GetManyUsersByIdsEndpoint,
            GetManyUsersByIdsRequest,
            ErrorResponse
        >(request);

        // Assert
        response.Should().NotBeNull();
        response!.StatusCode.Should().Be(HttpStatusCode.BadRequest);
        result.Should().NotBeNull();
        result!.Errors.Keys.Should().Contain(nameof(request.AppUserIds));
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

    private async Task<IEnumerable<AppUser>> CreateManyUsersAsync()
    {
        IEnumerable<AppUser>? appUsers = _userRequestGenerator.Generate(5);

        using IServiceScope scope = _apiWebFactory.Services.CreateScope();

        var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
        ArgumentNullException.ThrowIfNull(userManager);
        foreach (AppUser appUser in appUsers)
        {
            IdentityResult createUserResult = await userManager.CreateAsync(appUser);

            if (!createUserResult.Succeeded)
                throw new Exception("Unable to create user");
        }

        return appUsers;
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
}
