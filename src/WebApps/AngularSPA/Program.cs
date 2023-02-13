using Infrastructure.Web;
using Serilog;

var builder = WebApplication.CreateBuilder(
    new WebApplicationOptions { Args = args, ContentRootPath = Directory.GetCurrentDirectory() }
);

var config = builder.Configuration;
config.AddEnvironmentVariables("solarengineer_");

builder.Host.UseSerilog(
    (_, loggerConfig) =>
    {
        loggerConfig.WriteTo
            .Console()
            .ReadFrom.Configuration(
                config
            );
    }
);
const string corsPolicy = "CorsPolicy";

builder.Services.InitCors(corsPolicy);

builder.Services.AddControllersWithViews();

builder.Services.AddRazorPages();
builder.Services.AddSpaStaticFiles(configuration => { configuration.RootPath = "ClientApp/dist"; });

var app = builder.Build();

app.UseSerilogRequestLogging();


if (!app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// app.UseHttpsRedirection();
app.UseStaticFiles();

if (!app.Environment.IsDevelopment()) app.UseSpaStaticFiles();

app.UseRouting();

app.Use((
    ctx,
    next
) =>
{
    if (ctx.Request.Path.StartsWithSegments("/api"))
    {
        ctx.Response.StatusCode = 404;
        return Task.CompletedTask;
    }

    return next();
});

app.MapControllers();
app.MapDefaultControllerRoute();

app.MapGet("/test", () => "Hello World!");

app.UseSpa(spa =>
{
    spa.Options.SourcePath = "ClientApp";
    if (app.Environment.IsDevelopment()) spa.UseProxyToSpaDevelopmentServer("http://localhost:4200");
});

app.Run();