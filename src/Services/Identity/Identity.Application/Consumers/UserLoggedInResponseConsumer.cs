using Identity.Application.Repositories.AppUsers;
using Infrastructure.Contracts.Data;
using Infrastructure.Contracts.Events;
using Infrastructure.Logging;
using MassTransit;
using Microsoft.Extensions.Logging;

namespace Identity.Application.Consumers;

public class UserLoggedInResponseConsumer : IConsumer<UserLoggedInResponse>
{
    private readonly IAppUsersRepository _appUsersRepository;
    private readonly ILogger<UserLoggedInResponseConsumer> _logger;

    public UserLoggedInResponseConsumer(ILogger<UserLoggedInResponseConsumer> logger,
        IAppUsersRepository appUsersRepository)
    {
        _logger = logger;
        _appUsersRepository = appUsersRepository;
    }

    public async Task Consume(ConsumeContext<UserLoggedInResponse> context)
    {
        _logger.LogInformation("UserLoggedInResponseConsumer: {@User}",
            context.Message);
        var messageUser = new UserDto
        {
            FirstName = context.Message.DisplayName,
            LastName = context.Message.DisplayName,
            Id = context.Message.Id,
            DisplayName = context.Message.DisplayName,
            UserName = context.Message.UserName,
            PhotoUrl = context.Message.PhotoUrl
        };
        context.Message.DumpObjectJson();
        var user = await _appUsersRepository.GetByIdAsync(context.Message.Id);
        if (user is null)
        {
            await context.RespondAsync(new UserNotFound(context.Message.Id));
            return;
        }

        await context.RespondAsync(new UserFound(context.Message.Id));
    }
}