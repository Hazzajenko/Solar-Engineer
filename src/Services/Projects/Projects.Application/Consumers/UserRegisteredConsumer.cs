using ApplicationCore.Events.AppUsers;
using MassTransit;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Repositories.ProjectUsers;
using Projects.Domain.Entities;

namespace Projects.Application.Consumers;

public class UserRegisteredConsumer : IConsumer<UserRegistered>
{
    private readonly ILogger<UserRegisteredConsumer> _logger;
    private readonly IProjectsUnitOfWork _unitOfWork;

    public UserRegisteredConsumer(
        ILogger<UserRegisteredConsumer> logger,
        IProjectsUnitOfWork unitOfWork
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async Task Consume(ConsumeContext<UserRegistered> context)
    {
        _logger.LogInformation("UserRegisteredConsumer: {@User}", context.Message);
        Guid appUserId = context.Message.Id;

        ProjectUser? projectUser = await _unitOfWork.ProjectUsersRepository.GetByIdAsync(appUserId);
        if (projectUser is not null)
        {
            _logger.LogError(
                "UserRegisteredConsumer: User already exists, {@User}",
                context.Message
            );
            return;
        }

        projectUser = new ProjectUser(appUserId);
        await _unitOfWork.ProjectUsersRepository.AddAsync(projectUser);
        await _unitOfWork.SaveChangesAsync();
    }
}
