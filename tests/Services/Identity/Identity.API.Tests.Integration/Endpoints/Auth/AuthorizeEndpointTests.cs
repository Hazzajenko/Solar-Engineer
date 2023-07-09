/*
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
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
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Moq;

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

        // var ep = Factory.Create<AuthorizeEndpoint>(
        //     A.Fake<ILogger<AdminLogin>>(), //mock dependencies for injecting to the constructor
        //     A.Fake<IEmailService>(),
        //     fakeConfig);
        var userManager = _apiWebFactory.Services.GetService<UserManager<AppUser>>();
        ArgumentNullException.ThrowIfNull(userManager);
        AppUser? user = _userRequestGenerator.Generate();
        IdentityResult createUserResult = await userManager.CreateAsync(user);
        if (!createUserResult.Succeeded)
            throw new Exception("Failed to create test user.");

        var jwtTokenGenerator = _apiWebFactory.Services.GetService<IJwtTokenGenerator>();
        ArgumentNullException.ThrowIfNull(jwtTokenGenerator);
        var token = jwtTokenGenerator.GenerateToken(user.Id.ToString(), user.UserName);

        _client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue(
            "Bearer",
            token
        );
        // _client.
        
        // Act
        (HttpResponseMessage response, AuthorizeResponse? result) = await _client.POSTAsync<AuthorizeEndpoint, AuthorizeResponse>();

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
        AppUser? user = _userRequestGenerator.Generate();
        var userManager = _apiWebFactory.Services.GetService<UserManager<AppUser>>();
        ArgumentNullException.ThrowIfNull(userManager);
        IdentityResult createUserResult = await userManager.CreateAsync(user);

        if (!createUserResult.Succeeded)
            throw new Exception("Unable to create user");

        IdentityResult addRoleResult = await userManager.AddToRoleAsync(user, AppRoles.User);
        if (!addRoleResult.Succeeded)
            throw new Exception("Unable to add role to user");

        return user;
    }

    private async Task<string> GetAccessTokenAsync(string id, string userName)
    {
        var services = new ServiceCollection();
        services.AddSingleton<IJwtTokenGenerator, JwtTokenGenerator>();
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();
        IConfigurationRoot config = new ConfigurationBuilder().AddJsonFile("appsettings.Development.json").Build();
        services.Configure<JwtSettings>(config.GetSection("Jwt"));

        ServiceProvider serviceProvider = services.BuildServiceProvider();
        var jwtTokenGenerator = serviceProvider.GetService<IJwtTokenGenerator>();
        ArgumentNullException.ThrowIfNull(jwtTokenGenerator);
        await Task.CompletedTask;
        return jwtTokenGenerator.GenerateToken(id, userName);
    }
    
    private HttpContext CreateHttpContext(string token)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, "GoogleId"),
            new Claim(ClaimTypes.Name, "Test User"),
            //... any other claims
        };

        var claimsIdentity = new ClaimsIdentity(claims, "AuthenticationTypes.Federation");
        var authProperties = new AuthenticationProperties();
        var authTicket = new AuthenticationTicket(new ClaimsPrincipal(claimsIdentity), authProperties, "Google");

        var authResult = AuthenticateResult.Success(authTicket);
        // A.Fake<IEmailService>(),
        var authHandlerMock = new Mock<IAuthenticationService>();
        authHandlerMock
            .Setup(x => x.AuthenticateAsync(It.IsAny<HttpContext>(), It.IsAny<string>()))
            .ReturnsAsync(authResult);

        var serviceProviderMock = new Mock<IServiceProvider>();
        serviceProviderMock
            .Setup(x => x.GetService(typeof(IAuthenticationService)))
            .Returns(authHandlerMock.Object);

        return new DefaultHttpContext { RequestServices = serviceProviderMock.Object };

// Now the httpContext should act as if the user was authenticated via Google.

        // var context = new DefaultHttpContext();
        // context.Request.Headers["Authorization"] = $"Bearer {token}";
        // return context;
    }

    private void Http2()
    {
        var claimsPrincipal = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim(ClaimTypes.NameIdentifier, "User Id"),
            new Claim(ClaimTypes.Name, "User name"),
            // other claims as needed
        }, IdentityConstants.ExternalScheme));

        var httpContext = new DefaultHttpContext
        {
            User = claimsPrincipal
        };

        var authManagerMock = new Mock<IAuthenticationService>();
        authManagerMock
            .Setup(am => am.AuthenticateAsync(It.IsAny<HttpContext>(), IdentityConstants.ExternalScheme))
            .ReturnsAsync(AuthenticateResult.Success(new AuthenticationTicket(claimsPrincipal, IdentityConstants.ExternalScheme)));

        // _apiWebFactory.Services.AddSingleton(authManagerMock.Object);
        var services = new ServiceCollection();
        services.AddSingleton(authManagerMock.Object);
        services.AddSingleton<IHttpContextAccessor>(new HttpContextAccessor { HttpContext = httpContext });

// create your HttpClient using TestServer, which will be configured with these services

    }
}
*/
