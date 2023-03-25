using EventBus.Domain.ProjectsEvents;
using Identity.Application.Data;
using Infrastructure.Logging;
using Serilog;

namespace Identity.Application;

public static class ProjectEventResponseHandler
{
    public static void Handle(ProjectEvent message, IdentityContext context, ILogger logger)
    {
        // AnsiConsole.Write($"[blue]Got pong #{message.Message}[/]");
        message.DumpObjectJson();

        // var project = context.Projects.FirstOrDefault(p => p.Id == message.ProjectId);
        // var users = message.
        // var user  = context.Users.FirstOrDefault(u => u.Id == message.);
    }
}