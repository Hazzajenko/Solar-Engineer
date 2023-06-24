// using Auth.API.Events;

// using DotNetCore.EntityFrameworkCore;

using System.Reflection;
using Mapster;
using MapsterMapper;
using Messages.Application.Data;
using Messages.Application.Data.UnitOfWork;
using Messages.Application.Repositories.GroupChatMessages;
using Messages.Application.Repositories.GroupChats;
using Messages.Application.Repositories.GroupChatServerMessages;
using Messages.Application.Repositories.Messages;
using Messages.Application.Repositories.UserGroupChats;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Messages.Application.Extensions;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        services.AddScoped<IMessagesUnitOfWork, MessagesUnitOfWork>();
        services.AddScoped<IAppUserGroupChatsRepository, AppAppUserGroupChatsRepository>();
        services.AddScoped<IMessagesRepository, MessagesRepository>();
        services.AddScoped<IGroupChatsRepository, GroupChatsRepository>();
        services.AddScoped<IGroupChatMessagesRepository, GroupChatMessagesRepository>();
        services.AddScoped<IGroupChatServerMessagesRepository, GroupChatServerMessagesRepository>();
        services.AddMediator(options =>
        {
            options.ServiceLifetime = ServiceLifetime.Transient;
        });
        services.AddMappings();

        return services;
    }

    private static IServiceCollection AddMappings(this IServiceCollection services)
    {
        var config = TypeAdapterConfig.GlobalSettings;
        config.Scan(Assembly.GetExecutingAssembly());

        services.AddSingleton(config);
        services.AddScoped<IMapper, ServiceMapper>();
        return services;
    }
}
