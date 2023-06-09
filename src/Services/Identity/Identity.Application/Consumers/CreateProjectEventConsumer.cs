using Identity.Application.Repositories.AppUsers;
using Infrastructure.Contracts.Events;
using Infrastructure.Logging;
using MassTransit;
using Microsoft.Extensions.Logging;
using Projects.Contracts.Events;

namespace Identity.Application.Consumers;

public class CreateProjectEventConsumer : IConsumer<CreateProjectEvent>
{
    private readonly IAppUsersRepository _appUsersRepository;
    private readonly ILogger<CreateProjectEventConsumer> _logger;

    public CreateProjectEventConsumer(ILogger<CreateProjectEventConsumer> logger,
        IAppUsersRepository appUsersRepository)
    {
        _logger = logger;
        _appUsersRepository = appUsersRepository;
    }

    public async Task Consume(ConsumeContext<CreateProjectEvent> context)
    {
        _logger.LogInformation("CreateProjectEventConsumer: {@User}",
            context.Message);
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