using Bogus;
using Infrastructure.Logging;
using Projects.Domain.Entities;

namespace Projects.Application.Data.Bogus;

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
        var projects = GetProjectGenerator().Generate(1);
        var appUserProjects = new List<AppUserProject>();
        foreach (var project in projects)
            appUserProjects.AddRange(GetAppUserProjectGenerator(project.Id).Generate(10));
        appUserProjects.DumpObjectJson();
    }

    public static Faker<AppUserProject> GetAppUserProjectGenerator(Guid projectId)
    {
        return new Faker<AppUserProject>()
            .RuleFor(x => x.AppUserId, f => Guid.NewGuid())
            .RuleFor(x => x.ProjectId, f => projectId)
            .RuleFor(x => x.Role, f => f.PickRandom("Admin", "Member"))
            .RuleFor(x => x.CanCreate, f => f.Random.Bool())
            .RuleFor(x => x.CanDelete, f => f.Random.Bool())
            .RuleFor(x => x.CanInvite, f => f.Random.Bool())
            .RuleFor(x => x.CanKick, f => f.Random.Bool());
    }

    public static Faker<Project> GetProjectGenerator()
    {
        return new Faker<Project>()
            .RuleFor(x => x.Id, f => Guid.NewGuid())
            .RuleFor(x => x.Name, f => f.Lorem.Sentence(3))
            .RuleFor(x => x.CreatedById, f => Guid.NewGuid())
            .RuleFor(x => x.CreatedTime, f => f.Date.Past())
            .RuleFor(x => x.LastModifiedTime, f => f.Date.Past())
            .RuleFor(
                x => x.AppUserProjects,
                f =>
                    new List<AppUserProject>
                    {
                        new()
                        {
                            AppUserId = Guid.NewGuid(),
                            Role = "Admin",
                            CanCreate = true,
                            CanDelete = true,
                            CanInvite = true,
                            CanKick = true
                        }
                    }
            );
    }
}