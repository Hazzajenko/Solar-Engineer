using Bogus;
using Identity.Domain;
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
        /*
         var projects = GetProjectGenerator().Generate(1);
        var appUserProjects = new List<AppUserProject>();
        foreach (var project in projects) appUserProjects.AddRange(GetAppUserProjectGenerator(project.Id).Generate(10));
        appUserProjects.DumpObjectJson();
        */
        var authUsers = GetAppUserGenerator().Generate(10);
        authUsers.DumpObjectJson();
    }

    public static Faker<AppUser> GetAppUserGenerator()
    {
        /*var firstName = new Faker().Name.FirstName();
        var lastName = new Faker().Name.LastName();
        var userName = new Faker().Internet.UserName(firstName, lastName);
        var email = new Faker().Internet.Email(firstName, lastName);
        var passwordHash = "Password123!";
        var photoUrl = $"https://robohash.org/{userName}.png?size=30x30&set=set1";
        var displayName = $"{firstName} {lastName[0]}";*/
        // var createdTime = new Faker().Date.Past();
        // var lastModifiedTime = new Faker().Date.Past();

        return new Faker<AppUser>()
            .RuleFor(x => x.Id, f => Guid.NewGuid())
            .RuleFor(x => x.Email, f => f.Internet.Email())
            // .RuleFor(x => x.PasswordHash, f => "Password123!")
            .RuleFor(x => x.FirstName, f => f.Name.FirstName())
            .RuleFor(x => x.LastName, f => f.Name.LastName())
            .RuleFor(x => x.DisplayName, f => $"{f.Name.FirstName()} {f.Name.LastName()[0]}")
            .RuleFor(
                x => x.PhotoUrl,
                f => $"https://robohash.org/{f.Internet.UserName()}.png?size=30x30&set=set1"
            )
            .RuleFor(x => x.UserName, f => f.Internet.UserName())
            .RuleFor(x => x.CreatedTime, f => f.Date.Past())
            .RuleFor(x => x.LastModifiedTime, f => f.Date.Past());
        /*.RuleFor(x => x.PasswordHash, f => passwordHash)
        .RuleFor(x => x.FirstName, f => firstName)
        .RuleFor(x => x.LastName, f => lastName)
        .RuleFor(x => x.DisplayName, f => displayName)
        .RuleFor(x => x.PhotoUrl, f => photoUrl)
        .RuleFor(x => x.UserName, f => userName)*/
        ;
    }
}