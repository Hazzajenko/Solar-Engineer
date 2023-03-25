using EventBus.Domain;
using EventBus.Domain.AppUserEvents;
using Infrastructure.Contracts.Data;
using Infrastructure.Logging;
using Projects.Application.Data.UnitOfWork;
using Projects.Domain.Entities;
using Wolverine;

namespace Projects.Application.Events;

public static class AppUserEventHandler
{
    // Simple message handler for the PingMessage message type
    public static ValueTask Handle(
        // The first argument is assumed to be the message type
        AppUserEvent message,
        // Wolverine supports method injection similar to ASP.Net Core MVC
        // In this case though, IMessageContext is scoped to the message
        // being handled
        // todo add db
        IMessageContext context,
        IProjectsUnitOfWork unitOfWork
    )
    {
        message.DumpObjectJson();
        // var type = message.AppUserEventType;
        // var typeString = type.ToString();
        // Log.Logger.Information("AppUserEvent type: {Type}", typeString);
        // AnsiConsole.Write($"[blue]Got ping #{message.User}[/]");
        if (message.AppUserEventType == AppUserEventType.LoggedIn ||
            message.AppUserEventType == AppUserEventType.Created)
        {
            var existingProjectUser = unitOfWork.ProjectUsersRepository
                .GetByIdAsync(message.User.Id)
                .Result;
            if (existingProjectUser == null)
            {
                var projectUser = ProjectUser.Create(
                    message.User.Id,
                    message.User.UserName,
                    message.User.DisplayName,
                    message.User.PhotoUrl
                );
                unitOfWork.ProjectUsersRepository.AddAsync(projectUser).Wait();
                unitOfWork.SaveChangesAsync().Wait();
                var projectUserDto = new UserDto
                {
                    Id = projectUser.Id,
                    UserName = projectUser.UserName,
                    DisplayName = projectUser.DisplayName,
                    PhotoUrl = projectUser.PhotoUrl
                };

                var projectUserCreatedResponse = new AppUserEventResponse(
                    message.Id,
                    EventResponseType.Created,
                    projectUserDto
                );
                return context.RespondToSenderAsync(projectUserCreatedResponse);
            }

            var exProjectUserDto = new UserDto
            {
                Id = existingProjectUser.Id,
                UserName = existingProjectUser.UserName,
                DisplayName = existingProjectUser.DisplayName,
                PhotoUrl = existingProjectUser.PhotoUrl
            };
            var projectUserCreatedResponseV2 = new AppUserEventResponse(
                message.Id,
                EventResponseType.NoChange,
                exProjectUserDto
            );
            return context.RespondToSenderAsync(projectUserCreatedResponseV2);
        }

        return ValueTask.CompletedTask;

        // var response = new AppUserEventResponse(message.AppUserEventType, "Pong");

        // This usage will send the response message
        // back to the original sender. Wolverine uses message
        // headers to embed the reply address for exactly
        // this use case
        // return context.RespondToSenderAsync(response);
    }
}