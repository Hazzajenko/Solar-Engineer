﻿// using Auth.API.Events;

// using DotNetCore.EntityFrameworkCore;

using Infrastructure.Grpc;
using MassTransit;
using Messages.API.Consumers;
using Messages.API.Data;
using Messages.API.Repositories.GroupChatMessages;
using Messages.API.Repositories.GroupChats;
using Messages.API.Repositories.GroupChatServerMessages;
using Messages.API.Repositories.Messages;
using Messages.API.Repositories.UserGroupChats;

namespace Messages.API.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddAppServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddTransient<GrpcExceptionInterceptor>();
        services.AddScoped<IMessagesUnitOfWork, MessagesUnitOfWork>();
        services.AddScoped<IUserGroupChatsRepository, UserGroupChatsRepository>();
        services.AddScoped<IMessagesRepository, MessagesRepository>();
        services.AddScoped<IGroupChatsRepository, GroupChatsRepository>();
        services.AddScoped<IGroupChatMessagesRepository, GroupChatMessagesRepository>();
        services.AddScoped<IGroupChatServerMessagesRepository, GroupChatServerMessagesRepository>();
        services.AddMediator(options => { options.ServiceLifetime = ServiceLifetime.Transient; });

        services.AddMassTransit(x =>
        {
            // x.UsingRabbitMq();
            // x.AddConsumer<TicketConsumer>();
            x.AddConsumer<AppUserLoggedInConsumer>();
            x.AddBus(provider => Bus.Factory.CreateUsingRabbitMq(config =>
            {
                // config.UseHealthCheck(provider);
                config.Host(new Uri("rabbitmq://localhost"), h =>
                {
                    h.Username("guest");
                    h.Password("guest");
                });
                // appUserLoggedIn-Messages
                config.ReceiveEndpoint("appUserLoggedIn-Messages", ep =>
                {
                    ep.PrefetchCount = 16;
                    ep.UseMessageRetry(r => r.Interval(2, 100));
                    ep.ConfigureConsumer<AppUserLoggedInConsumer>(provider);
                });
                config.ReceiveEndpoint("appUserLoggedInQueue", ep =>
                {
                    ep.PrefetchCount = 16;
                    // ep.
                    ep.UseMessageRetry(r => r.Interval(2, 100));
                    ep.ConfigureConsumer<AppUserLoggedInConsumer>(provider);
                });
                /*config.ReceiveEndpoint("createdAppUserQueue", ep =>
                {
                    ep.PrefetchCount = 16;
                    ep.UseMessageRetry(r => r.Interval(2, 100));
                    ep.ConfigureConsumer<CreatedAppUserConsumer>(provider);
                });*/
            }));
        });

        return services;
    }
}