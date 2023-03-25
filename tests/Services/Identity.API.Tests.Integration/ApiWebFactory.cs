using DotNet.Testcontainers.Builders;
using DotNet.Testcontainers.Containers;
using Identity.Application.Data;
using Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Logging;

namespace Identity.API.Tests.Integration;

// We use the "IApiMarker" interface to reference our API project.
// We also implement the "IAsyncLifetime" interface to properly initialize and dispose of our used services.
public class ApiWebFactory : WebApplicationFactory<IIdentityApiAssemblyMarker>, IAsyncLifetime
{
    private readonly IContainer _dbContainer = new ContainerBuilder()
        .WithName("postgres")
        .WithImage("postgres:latest")
        .WithEnvironment("POSTGRES_USER", "course")
        .WithEnvironment("POSTGRES_PASSWORD", "changeme")
        .WithEnvironment("POSTGRES_DB", "mydb")
        .WithPortBinding(5555, 5432)
        .WithWaitStrategy(Wait.ForUnixContainer().UntilPortIsAvailable(5432))
        .Build();

    public async Task InitializeAsync()
    {
        // Start up our Docker container with the Postgres DB
        await _dbContainer.StartAsync();
    }

    public new async Task DisposeAsync()
    {
        // Stop our Docker container with the Postgres DB
        await _dbContainer.DisposeAsync();
        await base.DisposeAsync();
    }

    // We set up our test API server with this override
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        // We disable any logging-providers for our test.
        builder.ConfigureLogging(logging => logging.ClearProviders());

        // We configure our services for testing
        builder.ConfigureTestServices(services =>
        {
            // remove any DbContextOptions registrations
            var descriptor = services.SingleOrDefault(
                d => d.ServiceType == typeof(DbContextOptions<IdentityContext>)
            );

            // Remove any DbContext registrations
            services.RemoveAll(typeof(IdentityContext));

            // Register our DbContext with the test DB connection string provided from our container
            /*var config = new ConfigurationBuilder()
                .AddInMemoryCollection(new[]
                {
                    new KeyValuePair<string, string>("ConnectionStrings:PostgresConnection",
                        $"Server=localhost;Port=5555;Database=mydb;User ID=course;Password=changeme;")
                })
                .Build();*/
            // var config = new IConfiguration
            services.InitDbContext<IdentityContext>(
                inputConnectionString: "Server=localhost;Port=5555;Database=mydb;User ID=course;Password=changeme;"
            );
            // services.AddScoped<IIdentityUnitOfWork, IdentityUnitOfWork>();
            services.AddScoped<IdentityContext>();
            /*services
                .AddIdentity<AppUser, AppRole>()
                .AddRoleManager<RoleManager<AppRole>>()
                .AddSignInManager<SignInManager<AppUser>>()
                .AddUserManager<UserManager<AppUser>>()
                .AddRoleValidator<RoleValidator<AppRole>>()
                .AddEntityFrameworkStores<IdentityContext>()
                .AddDefaultTokenProviders();*/

            // services.AddPersistence(_dbContainer.ConnectionString);
        });
    }
}