using Bogus;
using Identity.Domain.Auth;
using Infrastructure.Logging;

namespace Identity.Application.Data.Bogus;

public static class BogusGenerators
{
    /*public static void GenerateData()
    {
        var projects = GetProjectGenerator().Generate(10);
        var appUserProjects = new List<AppUserProject>();
        foreach (var project in projects)
        {
            appUserProjects.AddRange(GetAppUserProjectGenerator(project.Id).Generate(10));
        }
    }*/

    public static void InitBogusData()
    {
        /*var projects = GetProjectGenerator().Generate(1);
        var appUserProjects = new List<AppUserProject>();
        foreach (var project in projects) appUserProjects.AddRange(GetAppUserProjectGenerator(project.Id).Generate(10));
        appUserProjects.DumpObjectJson();*/
        var authUsers = GetAppUserGenerator().Generate(10);
        authUsers.DumpObjectJson();
    }

    public static Faker<AppUser> GetAppUserGenerator()
    {
        return new Faker<AppUser>()
            .RuleFor(x => x.Id, f => Guid.NewGuid())
            .RuleFor(x => x.Email, f => f.Internet.Email())
            .RuleFor(x => x.PasswordHash, f => f.Internet.Password())
            .RuleFor(x => x.FirstName, f => f.Name.FirstName())
            .RuleFor(x => x.LastName, f => f.Name.LastName())
            .RuleFor(x => x.DisplayName, f => f.Name.FullName())
            .RuleFor(x => x.PhotoUrl, f => f.Internet.Avatar())
            .RuleFor(x => x.UserName, f => f.Internet.UserName())
            .RuleFor(x => x.CreatedTime, f => f.Date.Past())
            .RuleFor(x => x.LastModifiedTime, f => f.Date.Past());
    }
}