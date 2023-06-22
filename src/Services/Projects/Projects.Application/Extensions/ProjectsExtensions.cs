using Projects.Contracts.Data;
using Projects.Domain.Entities;

namespace Projects.Application.Extensions;

public static class ProjectsExtensions
{
    public static string GetProjectLoggingString(this Project project)
    {
        return $"Project: {project.Name} ({project.Id.ToString()})";
    }

    public static string GetProjectLoggingString(this ProjectDto project)
    {
        return $"Project: {project.Name} ({project.Id})";
    }
}
