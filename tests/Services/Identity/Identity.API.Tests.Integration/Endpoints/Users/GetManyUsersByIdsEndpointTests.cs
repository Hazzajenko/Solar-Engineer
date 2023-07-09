using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using ApplicationCore.Exceptions;
using ApplicationCore.Extensions;
using Bogus;
using FastEndpoints;
using FluentAssertions;
using Identity.API.Endpoints.Users;
using Identity.API.Tests.Integration.TestUtils;
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
    private readonly HttpClient _authenticatedClient;

    public GetManyUsersByIdsEndpointTests(ApiWebFactory apiWebFactory)
    {
        _apiWebFactory = apiWebFactory;
        _client = apiWebFactory.CreateClient();
        _authenticatedClient = apiWebFactory
            .CreateAuthenticatedHttpClient()
            .GetAwaiter()
            .GetResult();
    }

    [Fact]
    public async Task HandleGetManyUsersByIdsEndpoint_WhenUserIdsAreValid_ShouldReturnWebUserDtoList()
    {
        // Arrange
        // await _client.CreateAuthenticatedHttpClient();
        var otherUsers = await CreateManyUsersAsync();
        var request = new GetManyUsersByIdsRequest
        {
            AppUserIds = otherUsers.Select(x => x.Id.ToString()).ToList()
        };

        // Act
        (HttpResponseMessage response, GetManyUsersByIdsResponse? result) =
            await _authenticatedClient.POSTAsync<
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
        // HttpClient client = await _apiWebFactory.CreateAuthenticatedHttpClientV2();
        // HttpClient client = await _apiWebFactory.CreateAuthenticatedHttpClientV2();
        // await _client.CreateAuthenticatedHttpClient();
        var invalidUserIds = Enumerable.Range(0, 5).Select(_ => Guid.NewGuid().ToString()).ToList();
        var request = new GetManyUsersByIdsRequest { AppUserIds = invalidUserIds };

        // Act
        (HttpResponseMessage response, ErrorResponse? result) =
            await _authenticatedClient.POSTAsync<
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

    private async Task<IEnumerable<AppUser>> CreateManyUsersAsync()
    {
        IEnumerable<AppUser>? appUsers = UserRequestGenerator.Generate(5);

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
}
