using EventBus.Domain.AppUserEvents;
using EventBus.Domain.AppUserEvents.Responses;
using Infrastructure.Logging;
using Marten;
using Serilog;
using Wolverine;

namespace Identity.Application.Events;

public static class UserCreatedHandler
{
    public static ValueTask Handle(
        UserCreated message,
        IMessageContext context,
        IQuerySession session,
        IDocumentSession documentSession
    )
    {

        var dbMessage = session.Load<AppUserEventV2>(message.Id);

        if (dbMessage == null)
        {
            Log.Logger.Error("Message is null, message {@Message}", message);
            return ValueTask.CompletedTask;
            /*var newMessage = new AppUserEventV2
            {
                Id = message.Id,
                UserId = message.UserId,
                ServiceName = message.ServiceName
            };
            session.Store(newMessage);
            session.SaveChanges();*/
        }


        var queueRes = dbMessage.Queues.Find(x => x.Name == message.ServiceName.Name);
        if (queueRes == null)
        {
            Log.Logger.Error("Queue response is null, message {@Message}", message);
            dbMessage.Queues.Add(
                new QueueResponse
                {
                    Name = message.ServiceName.Name,
                    Success = true,
                    CompletedAt = DateTime.UtcNow
                }
            );
            documentSession.Store(dbMessage);
            // documentSession.Update(dbMessage);
        }
        else
        {
            Log.Logger.Information("Queue response is not null, message {@Message}", message);
            queueRes.Success = true;
            queueRes.CompletedAt = DateTime.UtcNow;
            // dbMessage.QueueResponses.
            documentSession.Store(dbMessage);
            // documentSession.Update(dbMessage);
        }

        documentSession.SaveChanges();
        // dbMessage.QueueResponses.Add(new QueueResponse());

        // documentSession.Update(queueRes);

        // session.DocumentStore.st
        // session.DocumentStore.Advanced.Clean.CompletelyRemoveAll();

        // store.Load/
        // context.
        // return context.RespondToSenderAsync("Hello from the other side");
        return ValueTask.CompletedTask;
    }
}