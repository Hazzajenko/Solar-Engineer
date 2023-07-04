using ApplicationCore.Events.AppUsers;
using Infrastructure.Logging;
using MassTransit;
using Projects.Application.Data.UnitOfWork;
using Projects.Domain.Entities;

namespace Projects.Application.Consumers;

public class UserLoggedInConsumer : IConsumer<UserLoggedIn>
{
    private readonly ILogger<UserLoggedInConsumer> _logger;

    private readonly IProjectsUnitOfWork _unitOfWork;

    public UserLoggedInConsumer(
        ILogger<UserLoggedInConsumer> logger,
        IProjectsUnitOfWork unitOfWork
    )
    {
        _logger = logger;
        _unitOfWork = unitOfWork;
    }

    public async Task Consume(ConsumeContext<UserLoggedIn> context)
    {
        _logger.LogInformation("UserLoggedInConsumer: {@User}", context.Message);
        Guid appUserId = context.Message.Id;

        ProjectUser? projectUser = await _unitOfWork.ProjectUsersRepository.GetByIdAsync(appUserId);
        if (projectUser is null)
        {
            _logger.LogError("UserLoggedInConsumer: User not found, {@User}", context.Message);
            projectUser = new ProjectUser(appUserId);
            await _unitOfWork.ProjectUsersRepository.AddAsync(projectUser);
            await _unitOfWork.SaveChangesAsync();
            return;
        }

        _logger.LogInformation("UserLoggedInConsumer: User found, {@User}", context.Message);
    }
}
