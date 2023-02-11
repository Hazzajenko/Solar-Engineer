using Identity.API;
using Identity.API.Data;
using Identity.API.Extensions;
using Identity.API.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

builder.Services.AddControllers();
builder.Services.AddInfrastructureServices();
// builder.Services.RegisterContext<IdentityContext>(builder.Configuration, Database.PostgreSQL, "DefaultConnection");
// builder.Services.AddScoped<IDataSeeder, IdentityDataSeeder>();
builder.Services.AddIdentityServerMan(builder.Environment, config, typeof(Config).Assembly.GetName().Name!);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddDbContext<IdentityContext>(config, builder.Environment);
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddAuthentication();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseIdentityServer();
app.UseStaticFiles();
app.UseRouting();
app.UseAuthorization();

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<IdentityContext>();
    var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    await context.Database.MigrateAsync();
    await AuthContextSeed.SeedAll(userManager, roleManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}

app.Run();