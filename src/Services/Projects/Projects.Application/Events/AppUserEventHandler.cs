using EventBus.Common;
using EventBus.Domain.AppUserEvents;
using EventBus.Domain.AppUserEvents.Responses;
using Infrastructure.Logging;
using Marten;
using Projects.Application.Data.UnitOfWork;
using Projects.Domain.Entities;
using Serilog;
using Wolverine;

namespace Projects.Application.Events;

public static class AppUserEventHandler
{
    public static ValueTask Handle(
        AppUserCreated message,
        IMessageContext context,
        IProjectsUnitOfWork unitOfWork,
        IDocumentSession session
    )
    {
        message.DumpObjectJson();
        context.Envelope?.DumpObjectJson();
        // context.CorrelationId.conso
        Log.Logger.Information("CorrelationId: {CorrelationId}", context.CorrelationId);
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

            var userCreated = new UserCreated(message.Id, ServiceName.Projects);
            session.Store(userCreated);
            // session.Events.StartStream(userCreated);
            // session.SaveChanges();

            return context.RespondToSenderAsync(userCreated);
        }

        var noChange = new UserNoChange(message.Id, ServiceName.Projects);
        session.Store(noChange);
        return context.RespondToSenderAsync(noChange);
    }

    // Simple message handler for the PingMessage message type
    public static ValueTask Handle(
        // The first argument is assumed to be the message type
        AppUserEvent message,
        // Wolverine supports method injection similar to ASP.Net Core MVC
        // In this case though, IMessageContext is scoped to the message
        // being handled
        // todo add db
        IMessageContext context,
        IProjectsUnitOfWork unitOfWork,
        IDocumentSession session
    )
    {
        message.DumpObjectJson();

        /*var pUser = ProjectUser.Create(
            message.User.Id,
            message.User.UserName,
            message.User.DisplayName,
            message.User.PhotoUrl
        );

        var res = new AppUserEventResponse(message.Id, EventResponseType.Created, null);*/

        // return context.RespondToSenderAsync(res);

        if (
            message.AppUserEventType == AppUserEventType.LoggedIn
            || message.AppUserEventType == AppUserEventType.Created
        )
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
                // context.
                // session.Store(projectUser);
                // session.Events.StartStream(projectUser);

                unitOfWork.SaveChangesAsync().Wait();

                var userCreated = new UserCreated(message.Id, ServiceName.Projects);
                session.Events.StartStream(userCreated);
                // session.Events.Append(message.User.Id, userCreated);
                session.SaveChanges();
                // documentStore.
                /*var projectUserDto = new UserDto
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
                );*/
                return context.RespondToSenderAsync(userCreated);
                // return session.SaveChangesAsync();
                // return context.RespondToSenderAsync(projectUserCreatedResponse);
            }

            return context.RespondToSenderAsync(new UserNoChange(message.Id, ServiceName.Projects));
            /*var exProjectUserDto = new UserDto
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
            return context.RespondToSenderAsync(projectUserCreatedResponseV2);*/
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