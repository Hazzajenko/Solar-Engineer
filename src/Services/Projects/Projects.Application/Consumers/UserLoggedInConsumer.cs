using Infrastructure.Contracts.Events;
using MassTransit;
using Projects.Application.Data.UnitOfWork;
using Projects.Application.Repositories.ProjectUsers;
using Projects.Domain.Entities;

namespace Projects.Application.Consumers;

public class UserLoggedInConsumer : IConsumer<UserLoggedIn>
{
    private readonly ILogger<UserLoggedInConsumer> _logger;
    private readonly IProjectsUnitOfWork _projectsUnitOfWork;
    private readonly IProjectUsersRepository _projectUsersRepository;

    public UserLoggedInConsumer(ILogger<UserLoggedInConsumer> logger, IProjectUsersRepository projectUsersRepository,
        IProjectsUnitOfWork projectsUnitOfWork)
    {
        _logger = logger;
        _projectUsersRepository = projectUsersRepository;
        _projectsUnitOfWork = projectsUnitOfWork;
    }

    public async Task Consume(ConsumeContext<UserLoggedIn> context)
    {
        _logger.LogInformation("UserLoggedInConsumer: {Id}, {UserName}, {DisplayName}, {PhotoUrl}",
            context.Message.Id, context.Message.UserName, context.Message.DisplayName, context.Message.PhotoUrl);
        var messageUser = new ProjectUser(context.Message.Id, context.Message.UserName, context.Message.DisplayName,
            context.Message.PhotoUrl);
        var user = await _projectUsersRepository.GetByIdAsync(context.Message.Id);
        if (user is null)
        {
            await _projectUsersRepository.AddAsync(messageUser);
        }
        else if (user.IsChanges(messageUser))
        {
            user.Update(context.Message.UserName, context.Message.DisplayName, context.Message.PhotoUrl);
            await _projectUsersRepository.UpdateAsync(user);
        }

        await _projectsUnitOfWork.SaveChangesAsync();
    }
}